const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { commentValidator } = require('../validators/validators');
const auth = require('../middleware/auth');

router.post('/', auth, commentValidator, commentController.create);
router.get('/:postId', commentController.getByPost);

module.exports = router;
