export const STAGE = process.env.STAGE || 'dev';
//MODULES
export const EASYBROKER_MODULE = 'easybroker-api';
//PARAMETERS
export const EASYBROKER_URL = `/${STAGE}/${EASYBROKER_MODULE}/easybroker/url`;
//SECRETS
export const EASYBROKER_CREDENTIALS = `/${STAGE}/${EASYBROKER_MODULE}/easybroker/credentials`;
