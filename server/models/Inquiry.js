import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    services: {
      type: [String],
      default: []
    },
    budget: {
      type: String,
      default: ''
    },
    timeline: {
      type: String,
      default: ''
    },
    details: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: 'Website Form'
    }
  },
  {
    timestamps: true
  }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
