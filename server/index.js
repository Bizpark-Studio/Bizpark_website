import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { SiteData } from './models/SiteData.js';
import { Inquiry } from './models/Inquiry.js';
import { defaultSeedData } from './defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from cwd and project root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Nodemailer Transporter Helper
function getEmailTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: (process.env.SMTP_PORT || '465') === '465',
    auth: {
      user: user,
      pass: pass
    }
  });
}

// Send Inquiry Email Notification
async function sendInquiryEmail(inquiry) {
  const transporter = getEmailTransporter();
  const adminRecipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'bizparkstudio@gmail.com';

  if (!transporter) {
    console.log('ℹ️ Email dispatch skipped: EMAIL_APP_PASSWORD not configured in .env');
    return { sent: false, reason: 'EMAIL_APP_PASSWORD not set in .env' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d0d0d; color: #f5f4ef; margin: 0; padding: 24px; }
        .box { max-width: 600px; margin: 0 auto; background: #141413; border: 1px solid #333; border-radius: 8px; overflow: hidden; }
        .hdr { background: #f2603e; color: #000; padding: 20px 24px; font-weight: 800; }
        .hdr h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 24px; }
        .row { margin-bottom: 16px; border-bottom: 1px solid #222; padding-bottom: 12px; }
        .lbl { font-size: 11px; text-transform: uppercase; color: #f2603e; font-weight: 700; margin-bottom: 3px; }
        .val { font-size: 14px; color: #f5f4ef; }
        .details-val { background: #0a0a0a; border: 1px solid #262626; padding: 14px; border-radius: 4px; font-size: 13px; line-height: 1.6; color: #ddd; white-space: pre-wrap; }
        .ftr { background: #0a0a0a; padding: 14px 24px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #222; }
        .btn { display: inline-block; background: #f2603e; color: #000; text-decoration: none; padding: 10px 22px; font-weight: 800; font-size: 12px; text-transform: uppercase; border-radius: 4px; margin-top: 14px; }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="hdr">
          <h1>⚡ New Client Project Inquiry</h1>
        </div>
        <div class="content">
          <div class="row">
            <div class="lbl">Client Name</div>
            <div class="val"><strong>${inquiry.name || 'Not provided'}</strong></div>
          </div>
          <div class="row">
            <div class="lbl">Email Address</div>
            <div class="val"><a href="mailto:${inquiry.email}" style="color: #f2603e; text-decoration: none;">${inquiry.email}</a></div>
          </div>
          <div class="row">
            <div class="lbl">Phone / WhatsApp</div>
            <div class="val">${inquiry.phone || 'Not provided'}</div>
          </div>
          <div class="row">
            <div class="lbl">Company / Brand</div>
            <div class="val">${inquiry.company || 'Not provided'}</div>
          </div>
          <div class="row">
            <div class="lbl">Services Requested</div>
            <div class="val">${inquiry.services && inquiry.services.length ? inquiry.services.join(', ') : 'Direct Inquiry'}</div>
          </div>
          <div class="row">
            <div class="lbl">Budget &amp; Timeline</div>
            <div class="val">${inquiry.budget || 'Custom'} (${inquiry.timeline || 'ASAP'})</div>
          </div>
          <div class="row" style="border-bottom: none;">
            <div class="lbl">Project Details / Message</div>
            <div class="details-val">${inquiry.details || inquiry.message || 'No additional details provided.'}</div>
          </div>
          <div style="text-align: center; margin-top: 18px;">
            <a href="mailto:${inquiry.email}?subject=Re: Your Project Inquiry with Bizpark Studio" class="btn">Reply Directly to Client →</a>
          </div>
        </div>
        <div class="ftr">
          Bizpark Studio Website Dispatcher • Saved into MongoDB Atlas
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Bizpark Studio Website" <${process.env.EMAIL_USER}>`,
      to: adminRecipient,
      replyTo: inquiry.email,
      subject: `⚡ New Project Inquiry: ${inquiry.name} (${inquiry.company || 'Website Lead'})`,
      html: htmlContent
    });
    console.log('✓ Inquiry email sent to', adminRecipient, 'MessageId:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Error sending inquiry email:', err.message);
    return { sent: false, error: err.message };
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_MONGODB_URI = 'mongodb+srv://anuradha:anuradha@anuradha.av9fjk8.mongodb.net/bizpark_studio?retryWrites=true&w=majority';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
const publicImagesDir = path.resolve(__dirname, '../public/images');
try {
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem on Vercel or cloud environments
}
app.use('/images', express.static(publicImagesDir));

// Multer storage: memory storage if on Vercel, disk storage locally
const isVercel = !!process.env.VERCEL;
const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, publicImagesDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const safeName = `upload_${Date.now()}${ext}`;
        cb(null, safeName);
      }
    });

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image/video files are allowed'));
    }
  }
});

// IMAGE UPLOAD ENDPOINT
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (req.file.buffer) {
    const base64 = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    console.log('✓ Image converted to base64 Data URI (serverless mode)');
    return res.json({ success: true, url: imageUrl });
  }
  const imageUrl = `/images/${req.file.filename}`;
  console.log('✓ Image uploaded:', imageUrl);
  res.json({ success: true, url: imageUrl });
});

// Connect to MongoDB Atlas (Serverless & Persistent mode)
let dbConnectPromise = null;
let lastConnectionError = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not found in environment or fallback');
    return false;
  }
  if (!dbConnectPromise) {
    dbConnectPromise = mongoose.connect(MONGODB_URI, {
      dbName: 'bizpark_studio',
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    }).then(async () => {
      lastConnectionError = null;
      console.log('✓ Successfully connected to MongoDB Atlas (Database: bizpark_studio)');

      // Seed database if empty
      try {
        const existing = await SiteData.findOne({ key: 'main_site_data' });
        if (!existing) {
          console.log('🌱 Seeding initial site data into MongoDB Atlas...');
          await SiteData.create(defaultSeedData);
          console.log('✓ Initial site data successfully seeded into MongoDB Atlas!');
        }
      } catch (seedErr) {
        console.error('Seed error:', seedErr);
      }
      return true;
    }).catch((err) => {
      dbConnectPromise = null;
      lastConnectionError = err.message;
      console.error('❌ MongoDB Atlas connection error:', err.message);
      return false;
    });
  }
  return await dbConnectPromise;
}

// Ensure database connection middleware for API invocations
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    if (mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch (e) {
        console.error('Database connection middleware error:', e);
      }
    }
  }
  next();
});

// Kick off initial connection attempt
connectDB();

// API HEALTH ENDPOINT (with full diagnostics)
app.get('/api/health', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch {}
  }
  const isDbReady = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    database: isDbReady ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    databaseName: 'bizpark_studio',
    environment: process.env.VERCEL ? 'vercel_serverless' : 'node_server',
    lastError: lastConnectionError,
    timestamp: new Date().toISOString()
  });
});

// GET SITE DATA
app.get('/api/data', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB not ready, returning fallback data');
      return res.json(defaultSeedData);
    }
    let data = await SiteData.findOne({ key: 'main_site_data' });
    if (!data) {
      data = await SiteData.create(defaultSeedData);
    }
    res.json(data);
  } catch (err) {
    console.error('Error fetching site data:', err);
    res.status(500).json({ error: 'Failed to fetch site data', fallback: defaultSeedData });
  }
});

// SAVE / UPDATE SITE DATA
app.post('/api/data', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'MongoDB Atlas is disconnected. Please check connection.',
        lastError: lastConnectionError
      });
    }
    const updatePayload = {
      categories: req.body.categories,
      homepageHeroBanners: req.body.homepageHeroBanners,
      softwareBanners: req.body.softwareBanners,
      softwareProducts: req.body.softwareProducts,
      teamMembers: req.body.teamMembers,
      settings: req.body.settings
    };
    const saved = await SiteData.findOneAndUpdate(
      { key: 'main_site_data' },
      { $set: updatePayload },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: saved });
  } catch (err) {
    console.error('Error saving site data to MongoDB:', err);
    res.status(500).json({ error: 'Failed to save site data: ' + err.message });
  }
});

// GET ALL INQUIRIES
app.get('/api/inquiries', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// SUBMIT NEW INQUIRY
app.post('/api/inquiries', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    let savedInq = null;
    if (mongoose.connection.readyState === 1) {
      savedInq = await Inquiry.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        services: req.body.services,
        budget: req.body.budget,
        timeline: req.body.timeline,
        details: req.body.details || req.body.message,
        source: req.body.source || 'Website Form'
      });
    }

    // Attempt real email dispatch via nodemailer
    const emailResult = await sendInquiryEmail(savedInq || req.body);

    res.json({
      success: true,
      savedToMongo: !!savedInq,
      emailSent: emailResult.sent,
      emailStatus: emailResult,
      inquiry: savedInq || req.body
    });
  } catch (err) {
    console.error('Error saving inquiry:', err);
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// EMAIL CONFIGURATION STATUS
app.get('/api/email-config', (req, res) => {
  res.json({
    emailUserConfigured: !!process.env.EMAIL_USER,
    emailPasswordConfigured: !!process.env.EMAIL_APP_PASSWORD,
    web3formsConfigured: !!(process.env.WEB3FORMS_ACCESS_KEY),
    senderEmail: process.env.EMAIL_USER || 'Not configured',
    adminRecipient: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'bizparkstudio@gmail.com'
  });
});

// TEST EMAIL DISPATCH
app.post('/api/test-email', async (req, res) => {
  try {
    const testInquiry = {
      name: 'Bizpark Studio Test Inquiry',
      email: req.body.recipient || process.env.EMAIL_USER || 'bizparkstudio@gmail.com',
      phone: '+94 77 123 4567',
      company: 'Bizpark Systems Verification',
      services: ['Web & App Development', 'Software Solutions'],
      budget: '$1,000 - $3,000',
      timeline: 'Immediate',
      details: 'This is a live test notification to verify that Gmail SMTP email delivery is functioning smoothly.',
      source: 'Admin Verification Tool'
    };

    const result = await sendInquiryEmail(testInquiry);
    res.json(result);
  } catch (err) {
    res.status(500).json({ sent: false, error: err.message });
  }
});

// DELETE INQUIRY
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState === 1) {
      await Inquiry.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Delete inquiry error:', err);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// CLEAR ALL INQUIRIES
app.delete('/api/inquiries', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState === 1) {
      await Inquiry.deleteMany({});
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Clear inquiries error:', err);
    res.status(500).json({ error: 'Failed to clear inquiries' });
  }
});

// SERVE COMPILED FRONTEND (FOR PRODUCTION HOSTING)
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  console.log('📦 Serving production frontend build from', distDir);
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Bizpark Studio Express Backend active at http://localhost:${PORT}`);
  });
}

export default app;
