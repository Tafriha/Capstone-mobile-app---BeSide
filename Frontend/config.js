// config.js
// Dev over USB with Expo Go + `adb reverse tcp:5000 tcp:5000`

export const BASE_URL = 'http://localhost:5000';

// If you also have Socket.IO (or another realtime service) on 3001,
// run: adb reverse tcp:3001 tcp:3001  and uncomment below.
// export const SOCKET_URL = 'http://localhost:3001';

// Optional default export (works if some files do `import config from './config'`)
export default {
  BASE_URL,
  // SOCKET_URL,
};
