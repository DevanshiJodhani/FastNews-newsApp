import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // Send welcome email
  const message = `Welcome to FastNews!, ${newUser.name}!\n\n We're excited to have you join our community of news enthusiasts. Thank you for signing up and becoming a part of our platform. At FastNews, we strive to bring you the latest and most relevant news updates straight to your fingertips. Whether it's breaking news or insightful articles, we aim to keep you informed and engaged.\n\nIf you have any questions or feedback, feel free to reach out to us. We value your opinion and are here to assist you.\n\nOnce again, thank you for signing up. We look forward to keeping you informed with our latest updates!\n\nBest regards,\nFastNews Team
  `;

  try {
    await sendEmail({
      email: newUser.email,
      subject: 'Welcome to Our Platform!',
      message,
    });
  } catch (err) {
    console.log('Error sending email:', err);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully!',
  });
};

export const getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};

export const updateDetails = catchAsync(async (req, res, next) => {
  const { email, name, role } = req.body;

  // FIND USER BY ID AND UPDATE
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { email, name, role },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(
      new AppError('User not found or unable to update details!', 404)
    );
  }

  // SEND EMAIL
  const message = `Dear ${updatedUser.name},\n\nYour account details have been successfully updated. If you did not request this change, please contact our support team immediately.\n\nBest regards,\nFastNews Team.`;

  try {
    await sendEmail({
      email: updatedUser.email,
      subject: 'Account Details Updated.',
      message,
    });
  } catch (error) {
    console.log('Error sending Email: ', error);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // FIND USER BY ID
  const user = await User.findById(req.user._id).select('+password');

  // CHECK IF CURRENT PASSWORD IS CORRECT
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect!', 401));
  }

  // UPDATE THE PASSWORD
  user.password = newPassword;
  await user.save();

  // SEND EMAIL
  const message = `Dear ${user.name},\n\nYour password has been successfully updated. If you did not request this change, please contact our support team immediately.\n\nBest regards,\nFastNews Team.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Updated Successfully',
      message,
    });
  } catch (error) {
    console.log('Error sending Email:', error);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }

  // SEND NEW TOKEN
  createSendToken(user, 200, res);
});
