import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['pothole', 'streetlight', 'garbage', 'drainage', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['pending', 'in-review', 'in-progress', 'resolved', 'rejected'],
      default: 'pending',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;