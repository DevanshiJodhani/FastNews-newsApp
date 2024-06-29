import MainPost from '../models/postModel.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';
import multer from 'multer';
import path from 'path';

// MULTER SETUP FOR FILE HANDLING
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `post-${Date.now()}${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

export const uploadPostImage = upload.single('image');

export const createPost = catchAsync(async (req, res, next) => {
  const { title, highlight, description, user } = req.body;
  const image = req.file ? req.file.filename : null;

  // console.log('Request Body:', req.body);
  // console.log('Uploaded File:', req.file);

  if (!title || !image || !highlight || !description) {
    return next(new AppError('All fields are required!', 400));
  }

  const newPost = await MainPost.create({
    title,
    image: `/images/${image}`,
    highlight,
    description,
    user,
  });

  // USER EMAIL
  const userDetail = await User.findById(user);

  // SEND EMAIL
  const message = `Dear ${userDetail.name},\n\nYour post titled "${title}" has been created successfully on our platform. Thank you for your contribution!\n\nBest regards,\nFastNews Team`;

  try {
    await sendEmail({
      email: userDetail.email,
      subject: 'Post Created Successfully!',
      message,
    });
  } catch (error) {
    console.log('Error sending email:', err);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      newPost,
    },
  });
});

export const getAllPost = catchAsync(async (req, res) => {
  const posts = await MainPost.find();

  res.status(200).json({
    status: 'success',
    result: posts.length,
    data: {
      posts,
    },
  });
});

export const getPost = catchAsync(async (req, res, next) => {
  const post = await MainPost.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const post = await MainPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const post = await MainPost.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const userDetail = await User.findById(post.user);

  // SEND EMAIL
  const message = `Dear ${userDetail.name},\n\nYour post titled "${post.title}" has been deleted successfully from our platform.\n\nBest regards,\nFastNews Team`;

  try {
    await sendEmail({
      email: userDetail.email,
      subject: 'Post Deleted Successfully!',
      message,
    });
  } catch (error) {
    console.log('Error sending email', error);
    return next(
      new AppError(
        'There was an error sending the email notification. The post was deleted successfully, but please check your email settings.',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully!',
  });
});

export const getPostsByUserId = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const posts = await MainPost.find({ user: userId });

  if (!posts) {
    return next(new AppError('No posts found for this user', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});
