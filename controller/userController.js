import User from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // SEND EMAIL
  const message = `Dear ${user.name},\n\nYour account has been successfully deleted. We're sorry to see you go. If you have any feedback or questions, please contact our support team.\n\nBest regards,\nFastNews Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Account Deleted Successfully!',
      message,
    });
  } catch (error) {
    console.log('Error sending email:', error);
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Your account has been deleted successfully!',
  });
});
