import User from '../models/User.js';
import Follow from '../models/Follow.js';

// Haversine formula helper for distance in km
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// @desc    Discover farmers by crop or text search (village/district/state)
// @route   GET /api/discover
// @access  Private
export const discoverFarmers = async (req, res, next) => {
  try {
    const { crop, query } = req.query;
    const filter = { _id: { $ne: req.user._id } };

    if (crop && crop.trim()) {
      filter.crops = { $regex: new RegExp(crop.trim(), 'i') };
    }

    if (query && query.trim()) {
      const q = query.trim();
      filter.$or = [
        { name: { $regex: new RegExp(q, 'i') } },
        { village: { $regex: new RegExp(q, 'i') } },
        { district: { $regex: new RegExp(q, 'i') } },
        { state: { $regex: new RegExp(q, 'i') } },
        { crops: { $regex: new RegExp(q, 'i') } }
      ];
    }

    const farmers = await User.find(filter)
      .limit(30)
      .sort({ createdAt: -1 });

    // Check which farmers the current user already follows
    const userFollows = await Follow.find({ follower: req.user._id }).select('following');
    const followingSet = new Set(userFollows.map((f) => f.following.toString()));

    const result = farmers.map((farmer) => {
      const safe = farmer.toSafeObject();
      safe.isFollowing = followingSet.has(farmer._id.toString());
      return safe;
    });

    res.status(200).json({
      success: true,
      count: result.length,
      farmers: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Discover farmers nearby using 2dsphere index
// @route   GET /api/discover/nearby
// @access  Private
export const discoverNearby = async (req, res, next) => {
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    const radiusKm = parseFloat(req.query.radius) || 25; // Default 25km

    // Fallback to logged-in user's stored coordinates if query coordinates not passed
    if (isNaN(lat) || isNaN(lon)) {
      if (req.user.location && req.user.location.coordinates) {
        lon = req.user.location.coordinates[0];
        lat = req.user.location.coordinates[1];
      } else {
        return res.status(400).json({
          success: false,
          message: 'Location coordinates are required for nearby discovery.'
        });
      }
    }

    const maxDistanceMeters = radiusKm * 1000;

    // Use MongoDB 2dsphere $near geospatial query
    const nearbyFarmers = await User.find({
      _id: { $ne: req.user._id },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: maxDistanceMeters
        }
      }
    }).limit(40);

    // Get following state
    const userFollows = await Follow.find({ follower: req.user._id }).select('following');
    const followingSet = new Set(userFollows.map((f) => f.following.toString()));

    // Format safe cards with distance in km (privacy preserved - no raw coordinates)
    const formatted = nearbyFarmers.map((farmer) => {
      const farmerLon = farmer.location.coordinates[0];
      const farmerLat = farmer.location.coordinates[1];
      const distance = calculateDistanceKm(lat, lon, farmerLat, farmerLon);

      const safe = farmer.toSafeObject();
      safe.distanceKm = distance;
      safe.isFollowing = followingSet.has(farmer._id.toString());
      return safe;
    });

    // Ensure sorted by distance
    formatted.sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({
      success: true,
      count: formatted.length,
      radiusKm,
      farmers: formatted
    });
  } catch (error) {
    next(error);
  }
};
