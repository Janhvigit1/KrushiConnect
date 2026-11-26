import dotenv from 'dotenv';
dotenv.config();

export const getIceServers = () => {
  const iceServers = [
    {
      urls: [
        process.env.STUN_SERVER || 'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302'
      ]
    }
  ];

  // If TURN credentials are provided in environment
  if (process.env.TURN_SERVER && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    iceServers.push({
      urls: process.env.TURN_SERVER,
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_CREDENTIAL
    });
  }

  return iceServers;
};
