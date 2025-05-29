// config.js
import Constants from 'expo-constants';

const HOST = Constants.manifest?.debuggerHost?.split(':')[0];
export const BASE_URL = `http://${HOST}:5000`; // Adjust port as needed
