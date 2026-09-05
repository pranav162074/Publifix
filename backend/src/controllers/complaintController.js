import Complaint from '../models/Complaint.js';
import cloudinary from '../config/cloudinary.js';

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
    const { title, description, category, address } = req.body;

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
      createdBy: req.user.id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's complaints
// @route  GET /api/complaints/mine
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(complaints);
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

// @desc   Get all complaints (admin)
// @route  GET /api/complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
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

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};