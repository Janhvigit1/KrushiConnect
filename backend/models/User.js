import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    village: {
      type: String,
      required: [true, 'Please provide your village/town'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'Please provide your district'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide your state'],
      trim: true
    },
    crops: {
      type: [String],
      default: []
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [78.9629, 20.5937] // Default center of India
      }
    },
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer'
    },
    status: {
      type: String,
      enum: ['active', 'banned'],
      default: 'active'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// 2dsphere index for geospatial discovery
userSchema.index({ location: '2dsphere' });
userSchema.index({ crops: 1 });
userSchema.index({ state: 1, district: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password and sensitive coordinates from public JSON
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  // Mask precise coordinates to preserve farmer privacy while giving approximate location
  if (obj.location && obj.location.coordinates) {
    obj.approximateCoordinates = [
      Math.round(obj.location.coordinates[0] * 100) / 100,
      Math.round(obj.location.coordinates[1] * 100) / 100
    ];
    delete obj.location;
  }
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
