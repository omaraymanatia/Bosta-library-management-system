import prisma from '../prisma/client.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getAllBorrows = catchAsync(async (req, res, next) => {
  const { userId, bookId, status, overdue, sortByOverdue } = req.query;

  const isAdmin = req.user.role === 'ADMIN';
  const now = new Date();

  let borrows = await prisma.borrow.findMany({
    where: {
      ...(isAdmin ? {} : { userId: req.user.id }),
      ...(userId && { userId: Number(userId) }),
      ...(bookId && { bookId: Number(bookId) }),
      ...(status && { status }),
      ...(overdue === 'true' && {
        dueAt: { lt: now },
        returnedAt: null,
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true,
        },
      },
    },
  });

  if (sortByOverdue) {
    borrows = borrows.map((borrow) => ({
      ...borrow,
      overdueDays: Math.floor((now - borrow.dueAt) / (1000 * 60 * 60 * 24)),
    }));

    // Sort descending: most overdue first
    borrows.sort((a, b) => b.overdueDays - a.overdueDays);
  }

  res.status(200).json({
    success: true,
    data: {
      borrows,
    },
  });
});

export const createBorrow = catchAsync(async (req, res, next) => {
  const { bookId, dueAt } = req.body;

  if (!bookId || !dueAt) {
    return next(new AppError('Book ID and due date are required', 400));
  }

  const book = await prisma.book.findUnique({
    where: { id: Number(bookId) },
  });

  if (!book) {
    return next(new AppError('Book not found', 404));
  }

  if (book.availableQuantity <= 0) {
    return next(new AppError('Book is not available for borrowing', 400));
  }

  const existingBorrow = await prisma.borrow.findFirst({
    where: {
      userId: req.user.id,
      bookId: Number(bookId),
      status: {
        in: ['PENDING', 'APPROVED'],
      },
    },
  });

  if (existingBorrow) {
    return next(
      new AppError('You already have this book borrowed or pending', 400)
    );
  }

  const newBorrow = await prisma.borrow.create({
    data: {
      userId: req.user.id,
      bookId: Number(bookId),
      dueAt: new Date(dueAt),
    },
  });

  res.status(201).json({
    success: true,
    data: {
      borrow: newBorrow,
    },
  });
});

export const getBorrowById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const borrow = await prisma.borrow.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true,
        },
      },
    },
  });

  if (!borrow) {
    return next(new AppError('Borrow not found', 404));
  }

  // Check if user can access this borrow
  if (req.user.role !== 'ADMIN' && borrow.userId !== req.user.id) {
    return next(new AppError('You can only access your own borrows', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      borrow,
    },
  });
});

export const updateBorrow = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { bookId, status } = req.body;

  const existingBorrow = await prisma.borrow.findUnique({
    where: { id: Number(id) },
  });

  if (!existingBorrow) {
    return next(new AppError('Borrow not found', 404));
  }

  // Borrower case
  if (req.user.role !== 'ADMIN') {
    if (existingBorrow.userId !== req.user.id) {
      return next(new AppError('You can only update your own borrows', 403));
    }

    if (existingBorrow.status !== 'PENDING') {
      return next(
        new AppError(
          'You can only update bookId while borrow is still PENDING',
          400
        )
      );
    }

    if (!bookId) {
      return next(new AppError('Book ID is required to update', 400));
    }

    const updatedBorrow = await prisma.borrow.update({
      where: { id: Number(id) },
      data: { bookId: Number(bookId) },
    });

    return res.status(200).json({
      success: true,
      data: { borrow: updatedBorrow },
    });
  }

  // Admin case
  const updateData = {};
  if (status) {
    updateData.status = status;
    if (status === 'APPROVED') updateData.approvedAt = new Date();
    if (status === 'RETURNED') updateData.returnedAt = new Date();
  }

  const updatedBorrow = await prisma.borrow.update({
    where: { id: Number(id) },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    data: { borrow: updatedBorrow },
  });
});

export const deleteBorrow = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingBorrow = await prisma.borrow.findUnique({
    where: { id: Number(id) },
  });

  if (!existingBorrow) {
    return next(new AppError('Borrow not found', 404));
  }

  if (req.user.role !== 'ADMIN' && existingBorrow.userId !== req.user.id) {
    return next(new AppError('You can only delete your own borrows', 403));
  }

  await prisma.borrow.delete({
    where: { id: Number(id) },
  });

  res.status(204).json({
    success: true,
    data: null,
  });
});
