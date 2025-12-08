const { body } = require("express-validator");

const validateContent = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn([
      'heritage',
      'intangible-oral',
      'intangible-crafts',
      'intangible-folklore',
      'clothing-men',
      'clothing-women',
      'clothing-boys',
      'clothing-girls',
      'food'
    ])
    .withMessage('Invalid content type'),
  
  body('region')
    .notEmpty()
    .withMessage('Region is required')
    .isIn(['northern', 'eastern', 'central', 'western', 'southern'])
    .withMessage('Invalid region')
];

const validateContentUpdate = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('description')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('type')
    .optional()
    .isIn([
      'heritage',
      'intangible-oral',
      'intangible-crafts',
      'intangible-folklore',
      'clothing-men',
      'clothing-women',
      'clothing-boys',
      'clothing-girls',
      'food'
    ])
    .withMessage('Invalid content type'),
  
  body('region')
    .optional()
    .isIn(['northern', 'eastern', 'central', 'western', 'southern'])
    .withMessage('Invalid region')
];


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة',
      errors: errors.array()
    });
  }
  next();
};




module.exports = {

  validateContent,
  validateContentUpdate
};