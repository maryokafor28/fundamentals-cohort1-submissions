import 'dotenv/config';

interface Config {
  port: string;
  mongoDbUrl: string;
  adminSecretToken: string;
  jwtSecret: string;
  loginLink: string;
  appPrefix: string;
  fileStoragePath: string;
  emailService: {
    testDomain: string;
    privateApiKey: string;
    publicApiKey: string;
    emailTemplates: {
      forgotPassword: string;
      verifyEmail: string;
      orderSuccess: string;
    };
  };
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
    folderPath: string;
    publicId_prefix: string;
    bigSize: string;
  };
  stripe: {
    publishable_key: string;
    secret_key: string;
    successUrl: string;
    cancelUrl: string;
    webhookSecret: string;
  };
  paypal: {
    baseUrl: string;
    returnUrl: string;
    cancelUrl: string;
  };
  frontend: {
    baseUrl: string;
  };
  backend: {
    baseUrl: string;
  };
}

const config: Config = {
  port: process.env.PORT || '3100',
  mongoDbUrl: process.env.MONGODB_URL || '',
  adminSecretToken: process.env.ADMIN_SECRET_TOKEN || '',
  jwtSecret: process.env.JWT_SECRET || '',
  loginLink: process.env.LOGIN_LINK || 'http://localhost:3000/auth',
  appPrefix: process.env.APP_PREFIX || '/api/v1',
  fileStoragePath: process.env.FILE_STORAGE_PATH || '../uploads/',
  emailService: {
    testDomain: process.env.MAILGUN_TEST_DOMAIN || '',
    privateApiKey: process.env.MAILGUN_PRIVATE_API_KEY || '',
    publicApiKey: process.env.MAILGUN_PUBLIC_API_KEY || '',
    emailTemplates: {
      forgotPassword: process.env.EMAIL_TEMPLATE_FORGOT_PASSWORD || 'forgot-password-template',
      verifyEmail: process.env.EMAIL_TEMPLATE_VERIFY_EMAIL || 'verify-email-template',
      orderSuccess: process.env.EMAIL_TEMPLATE_ORDER_SUCCESS || 'order-success'
    }
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    folderPath: process.env.CLOUDINARY_FOLDER_PATH || 'digizone/products/',
    publicId_prefix: process.env.CLOUDINARY_PUBLIC_ID_PREFIX || 'digi_prods_',
    bigSize: process.env.CLOUDINARY_BIG_SIZE || '400X400'
  },
  stripe: {
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secret_key: process.env.STRIPE_SECRET_KEY || '',
    successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/order-success',
    cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/order-cancel',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  paypal: {
    baseUrl: process.env.PAYPAL_BASE_URL || 'https://api.paypal.com',
    returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/payment-success',
    cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/payment-cancel'
  },
  frontend: {
    baseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:3000'
  },
  backend: {
    baseUrl: process.env.BACKEND_BASE_URL || 'http://localhost:3100'
  }
};

export default config;