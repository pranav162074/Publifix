import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import Complaint from '../models/Complaint.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar:
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1f2937&color=fff`,
});

// @desc   Register a new user
// @route  POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: buildUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: buildUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Google OAuth login/signup
// @route  POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        avatar: picture || '',
      });
    } else if (picture && !user.avatar) {
      user.avatar = picture;
      await user.save();
    }

    res.json({
      user: buildUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get current logged-in user
// @route  GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(buildUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Permanently delete the logged-in user's account
// @route  DELETE /api/auth/me
export const deleteMe = async (req, res) => {
  try {
    await Complaint.deleteMany({ createdBy: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};