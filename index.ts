// // import express from "express";
// // const app = express();

// // app.get("/", (req, res) => res.send("Express on Vercel"));

// // app.listen(3000, () => console.log("Server ready on port 3000."));

// // module.exports = app;

// import express from 'express';
// import dotenv from 'dotenv';
// import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
// import path from 'path';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
//   });

// app.post('/api/generateToken', (req, res) => {
//   const appId = process.env.APP_ID;
//   const appCertificate = process.env.APP_CERTIFICATE;
//   const channelName = req.body.channelName;
//   const uid = req.body.uid || 0;
//   const role = RtcRole.PUBLISHER;

//   const expirationTimeInSeconds = req.body.expiryTime;
//   const currentTimestamp = Math.floor(Date.now() / 1000);
//   const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//   if (!channelName) {
//     return res.status(400).json({ error: 'Channel name is required' });
//   }

//   try {
//     const token = RtcTokenBuilder.buildTokenWithUid(
//       appId,
//       appCertificate,
//       channelName,
//       uid,
//       role,
//       privilegeExpiredTs
//     );
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: 'Could not generate token' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



import express from 'express';
import dotenv from 'dotenv';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const appId = process.env.APP_ID;
const appCertificate = process.env.APP_CERTIFICATE;

// Ensure appId and appCertificate are defined
if (!appId) {
  throw new Error('APP_ID environment variable is not defined');
}

if (!appCertificate) {
  throw new Error('APP_CERTIFICATE environment variable is not defined');
}

app.use(express.json());

// POST request to generate token
app.post('/api/generateToken', (req, res) => {
  const channelName = req.body.channelName;
  const uid = req.body.uid || 0;
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = req.body.expiryTime;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Could not generate token' });
  }
});

// GET request to serve a sample page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
