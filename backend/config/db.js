import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import Post from '../models/Post.js';

let memoryServerInstance = null;

export const seedDemoData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo data for KrushiConnect...');

      const admin = await User.create({
        name: 'Janhvi (Platform Admin)',
        email: 'admin@krushiconnect.in',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        village: 'Platform HQ',
        district: 'Pune',
        state: 'Maharashtra',
        crops: ['Precision Farming', 'AgriTech'],
        bio: 'KrushiConnect Chief Administrator & Community Moderator.',
        location: { type: 'Point', coordinates: [73.8567, 18.5204] }
      });

      const ramesh = await User.create({
        name: 'Ramesh Patel',
        email: 'ramesh@krushiconnect.in',
        password: 'password123',
        role: 'farmer',
        isVerified: true,
        village: 'Rahuri',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        crops: ['Wheat', 'Sugarcane', 'Soybean'],
        bio: 'Next-gen organic farmer. Sharing drip irrigation & wheat yield insights.',
        location: { type: 'Point', coordinates: [74.6500, 19.3900] }
      });

      const suresh = await User.create({
        name: 'Suresh Kumar',
        email: 'suresh@krushiconnect.in',
        password: 'password123',
        role: 'farmer',
        isVerified: false,
        village: 'Baramati',
        district: 'Pune',
        state: 'Maharashtra',
        crops: ['Onion', 'Tomato', 'Grapes'],
        bio: 'Vegetable grower exploring low-cost solar cold storage.',
        location: { type: 'Point', coordinates: [74.5800, 18.1500] }
      });

      await Post.create([
        {
          author: ramesh._id,
          text: '🌾 Completed sowing of HD-2967 wheat today! Prepared the soil with 2 tons/acre vermicompost and set up inline drip fertigation. Hoping for a bumper winter harvest!',
          images: [],
          likesCount: 14,
          commentsCount: 3
        },
        {
          author: suresh._id,
          text: '🧅 Onion nursery in Baramati is 25 days old now. Sprayed biological neem oil (1500 ppm) early morning to prevent thrips damage. Fellow farmers, check your nurseries regularly!',
          images: [],
          likesCount: 9,
          commentsCount: 2
        }
      ]);

      console.log('✅ Demo data seeded successfully (Admin: admin@krushiconnect.in | Farmer: ramesh@krushiconnect.in)');
    }
  } catch (err) {
    console.warn('⚠️ Demo seeding warning:', err.message);
  }
};

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krushiconnect';

  try {
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`🌾 MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    await seedDemoData();
  } catch (err) {
    console.warn(`⚠️ Could not connect to primary MongoDB (${err.message}). Starting embedded MongoMemoryServer fallback...`);
    try {
      memoryServerInstance = await MongoMemoryServer.create();
      const inMemoryUri = memoryServerInstance.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`🌱 Connected to resilient In-Memory MongoDB at: ${inMemoryUri}`);
      await seedDemoData();
    } catch (memErr) {
      console.error('❌ Failed to connect to any MongoDB instance:', memErr.message);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};
