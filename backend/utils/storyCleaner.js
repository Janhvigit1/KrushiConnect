import Story from '../models/Story.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cleanupExpiredStories = async () => {
  try {
    const expiredStories = await Story.find({ expiresAt: { $lte: new Date() } });

    for (const story of expiredStories) {
      if (story.mediaUrl) {
        try {
          const filename = path.basename(story.mediaUrl);
          const filePath = path.join(__dirname, '..', 'uploads', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {
          // ignore file deletion failure
        }
      }
      await Story.findByIdAndDelete(story._id);
    }
  } catch (err) {
    console.error('Error during expired stories cleanup:', err.message);
  }
};
