// URLs
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export const BACKEND_URL = process.env.BACKEND_URL; 

// Slack Logging
export const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Compliance
export const TRM_API_KEY = process.env.TRM_API_KEY;

// Database
export const ROCKO_DB_HOST = process.env.ROCKO_DB_HOST;
export const ROCKO_DB_USER = process.env.ROCKO_DB_USER;
export const ROCKO_DB_PASSWORD = process.env.ROCKO_DB_PASSWORD;
export const ROCKO_DB_DATABASE = process.env.ROCKO_DB_DATABASE;

// Compliance
const sanc = ['cu', 'ir', 'kp', 'ru', 'sy', 'ua'];
const nonCompSanc = [
  'AF',
  'BY',
  'MM',
  'CF',
  'CD',
  'CI',
  'ET',
  'IQ',
  'LB',
  'LR',
  'LY',
  'ML',
  'NI',
  'SO',
  'SS',
  'SD',
  'VE',
  'YE',
  'ZW',
];
const balkans = ['AL', 'BA', 'ME', 'XK', 'MK', 'RS'];

export const BLACKLIST_COUNTRY_CODES = [...sanc, ...nonCompSanc, ...balkans].map(
    (c) => c.toUpperCase(),
  );

// Third Party Keys
export const VPNAPI_KEY = process.env.VPNAPI_KEY;
export const COINBASE_CLIENT_ID = process.env.COINBASE_CLIENT_ID;
export const COINBASE_CLIENT_SECRET = process.env.COINBASE_CLIENT_SECRET;
export const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
export const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID; 
// TODO remove sandbox key and add to secrets before production
export const DYNAMIC_PROJECT_ID = process.env.DYNAMIC_PROJECT_ID || '9d135ad4-a679-4475-a8c1-9df3bdf586de'; 