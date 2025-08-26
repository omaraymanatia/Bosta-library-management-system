import express from 'express';

import * as bookController from '../controllers/bookController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(bookController.getAllBooks) // user or admin gets all books
  .post(authController.restrictTo('ADMIN'), bookController.createBook) // admin create a book


router.route('/:id')
  .get(bookController.getBookById) // user or admin gets a book by ID
  .patch(authController.restrictTo('ADMIN'), bookController.updateBook) // admin updates a book by ID
  .delete(authController.restrictTo('ADMIN'), bookController.deleteBook); // admin deletes a book by ID

export default router;
