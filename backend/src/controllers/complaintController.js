import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import sendEmail from '../utils/sendEmail.js';
import mongoose from 'mongoose';

// Helper: upload a buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'publifix' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// @desc   Create a new complaint
// @route  POST /api/complaints
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, address, lat, lng } = req.body;

    let photoUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      address,
      photoUrl,
      location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
      createdBy: req.user.id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single complaint by ID
// @route  GET /api/complaints/:id
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's complaints
// @route  GET /api/complaints/mine
export const getMyComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Complaint.countDocuments({ createdBy: req.user.id });

    const complaints = await Complaint.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      complaints,
      page,
      totalPages: Math.ceil(total / limit),
      totalComplaints: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all complaints (admin)
// @route  GET /api/complaints
export const getAllComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Complaint.countDocuments();

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      complaints,
      page,
      totalPages: Math.ceil(total / limit),
      totalComplaints: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all complaints that have location data (for map view)
// @route  GET /api/complaints/map
export const getComplaintsForMap = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      'location.lat': { $exists: true },
      'location.lng': { $exists: true },
    }).select('title category status location createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusOptions = ['pending', 'in-review', 'in-progress', 'resolved', 'rejected'];
    const counts = Object.fromEntries(statusOptions.map((s) => [s, 0]));

    stats.forEach((s) => {
      counts[s._id] = s.count;
    });

    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

    res.json({ total, counts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update complaint status (admin)
// @route  PATCH /api/complaints/:id/status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    const user = await User.findById(complaint.createdBy);
    if (user && user.email) {
      sendEmail({
        to: user.email,
        subject: `Your complaint status has been updated`,
        text: `Hi ${user.name},\n\nYour complaint "${complaint.title}" status has been changed to: ${status}.\n\nYou can view the details in your Publifix dashboard.\n\n- Publifix Team`,
      });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};