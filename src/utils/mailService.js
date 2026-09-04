import { getStoreData, addInquiry } from '../data/store';

export async function submitInquiry(formData) {
  const storeData = getStoreData();
  const settings = storeData.settings || {
    adminEmail: 'bizparkstudio@gmail.com',
    whatsappNumber: '+94770000000',
    web3formsKey: ''
  };

  // 1. ALWAYS save lead to local storage first (Guarantees zero lost leads!)
  const savedInquiry = addInquiry(formData);

  let emailSent = false;
  let deliveryMethod = 'vault_only'; // 'smtp' | 'web3forms' | 'vault_only'
  let dispatchNote = '';

  // 2. Dispatch to Backend Express Server (Saves to MongoDB Atlas & sends SMTP email if configured)
  try {
    const apiRes = await fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        id: savedInquiry.id,
        date: savedInquiry.date
      })
    });
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (apiData.emailSent) {
        emailSent = true;
        deliveryMethod = 'smtp';
        dispatchNote = 'Direct SMTP email dispatched to admin inbox.';
      } else if (apiData.emailStatus?.reason) {
        dispatchNote = apiData.emailStatus.reason;
      }
    }
  } catch (err) {
    console.warn('Backend API connection warning (lead preserved locally):', err);
  }

  // 3. Fallback: Attempt Web3Forms dispatch if SMTP was not sent and Web3Forms key is set
  const accessKey = settings.web3formsKey || '';
  if (!emailSent && accessKey && accessKey.trim() !== '') {
    try {
      const emailSubject = `New Inquiry from ${formData.name} (${formData.company || formData.source || 'Website Lead'})`;
      const emailMessage = `
==============================================
NEW BIZPARK STUDIO CLIENT INQUIRY
==============================================
Name: ${formData.name}
Email: ${formData.email}
Phone / WhatsApp: ${formData.phone || 'Not provided'}
Company / Brand: ${formData.company || 'Not provided'}
Source: ${formData.source || 'Website'}
Date & Time: ${savedInquiry.date}

Selected Services: ${formData.services && formData.services.length > 0 ? formData.services.join(', ') : 'Direct Inquiry'}
Estimated Budget: ${formData.budget || 'Not specified'}
Target Timeline: ${formData.timeline || 'Not specified'}

Project Requirement Details:
${formData.details || formData.message || 'No additional details.'}
==============================================
Sent via Bizpark Studio Website Dispatcher
      `;

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          to_email: settings.adminEmail || 'bizparkstudio@gmail.com',
          from_name: formData.name,
          subject: emailSubject,
          message: emailMessage
        })
      });
      const resData = await res.json();
      if (resData.success) {
        emailSent = true;
        deliveryMethod = 'web3forms';
        dispatchNote = 'Dispatched via Web3Forms gateway.';
      }
    } catch (err) {
      console.warn('Web3Forms dispatch warning:', err);
    }
  }

  return {
    success: true,
    emailSent,
    deliveryMethod,
    dispatchNote,
    inquiry: savedInquiry,
    adminEmail: settings.adminEmail || 'bizparkstudio@gmail.com',
    whatsappUrl: generateWhatsAppUrl(formData, settings.whatsappNumber)
  };
}

export function generateWhatsAppUrl(formData, number = '+94770000000') {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const text = `Hello Bizpark Studio! 👋\n\nI just submitted a project inquiry on your website:\n• Name: ${formData.name}\n• Email: ${formData.email}\n• Requirement: ${formData.details || formData.message || 'Custom Project'}\n• Budget: ${formData.budget || 'Custom'}\n\nLooking forward to hearing from your team!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
