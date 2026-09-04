import mongoose from 'mongoose';

const siteDataSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_site_data',
      unique: true
    },
    categories: {
      type: Array,
      default: []
    },
    homepageHeroBanners: {
      type: Array,
      default: []
    },
    softwareBanners: {
      type: Array,
      default: []
    },
    softwareProducts: {
      type: Array,
      default: []
    },
    settings: {
      type: Object,
      default: {
        adminEmail: 'bizparkstudio@gmail.com',
        whatsappNumber: '+94770000000',
        web3formsKey: ''
      }
    }
  },
  {
    timestamps: true
  }
);

export const SiteData = mongoose.model('SiteData', siteDataSchema);
