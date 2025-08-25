const bcrypt = require("bcrypt");

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany();
  res.status(200).json({
    success: true,
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    success: true,
    data: {
        user: {
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        }
    }
  });
});


exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id },
  });

  res.status(204).json({
    success: true,
    data: null,
  });
});


exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});

exports.updateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    },
  });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id },
  });

  res.status(204).json({
    success: true,
    data: null,
  });
});
