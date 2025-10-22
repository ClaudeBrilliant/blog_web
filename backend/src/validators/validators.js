const { body } = require('express-validator');

exports.registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password at least 6 chars')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

exports.postCreateValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

exports.categoryValidator = [
  body('name').notEmpty().withMessage('Category name required')
];

exports.commentValidator = [
  body('content').notEmpty().withMessage('Comment content required'),
  body('authorName').notEmpty().withMessage('Author name required')
];
