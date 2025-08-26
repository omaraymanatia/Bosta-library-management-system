import prisma from '../prisma/client.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';


export const getAllBooks = catchAsync(async (req, res, next) => {
  const {title, author, isbn} = req.query;
  const books = await prisma.book.findMany({
    where: {
      AND: [
        title ? { title: { contains: title, mode: 'insensitive' } } : {},
        author ? { author: { contains: author, mode: 'insensitive' } } : {},
        isbn ? { isbn: { contains: isbn, mode: 'insensitive' } } : {},
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: {
      books,
    },
  });
});

export const createBook = catchAsync(async (req, res, next) => {
  const { isbn, title, author, shelfLocation, totalQuantity } = req.body;

  if (!isbn || !title || !author || !shelfLocation || !totalQuantity) {
    return next(new AppError('All fields are required: isbn, title, author, shelfLocation, totalQuantity', 400));
  }

  const existingBook = await prisma.book.findUnique({
    where: { isbn },
  });

  if (existingBook) {
    return next(new AppError('Book with this ISBN already exists', 400));
  }

  const newBook = await prisma.book.create({
    data: {
      isbn,
      title,
      author,
      shelfLocation,
      totalQuantity,
      availableQuantity: totalQuantity,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      book: {
        isbn: newBook.isbn,
        title: newBook.title,
        author: newBook.author,
        shelfLocation: newBook.shelfLocation,
        totalQuantity: newBook.totalQuantity,
        availableQuantity: newBook.availableQuantity,
        createdAt: newBook.createdAt,
        updatedAt: newBook.updatedAt,
      },
    },
  });
});


export const getBookById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!book) {
    return next(new AppError('Book not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      book: {
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        shelfLocation: book.shelfLocation,
        totalQuantity: book.totalQuantity,
        availableQuantity: book.availableQuantity,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    },
  });
});

export const updateBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isbn, title, author, shelfLocation, totalQuantity } = req.body;

  const oldBook = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!oldBook) {
    return next(new AppError("Book not found", 404));
  }

  const newAvailable =
    totalQuantity - oldBook.totalQuantity + oldBook.availableQuantity;

  const updatedBook = await prisma.book.update({
    where: { id: Number(id) },
    data: {
      isbn,
      title,
      author,
      shelfLocation,
      totalQuantity,
      availableQuantity: newAvailable,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      book: {
        isbn: updatedBook.isbn,
        title: updatedBook.title,
        author: updatedBook.author,
        shelfLocation: updatedBook.shelfLocation,
        totalQuantity: updatedBook.totalQuantity,
        availableQuantity: updatedBook.availableQuantity,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
      },
    },
  });
});


export const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingBook = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!existingBook) {
    return next(new AppError('Book not found', 404));
  }

  await prisma.book.delete({
    where: { id: Number(id) },
  });

  res.status(204).json({
    success: true,
    data: null,
  });
});
