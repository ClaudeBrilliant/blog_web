const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { postCreateValidator } = require('../validators/validators');

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', auth, upload.single('featuredImage'), postCreateValidator, postController.create);
router.put('/:id', auth, upload.single('featuredImage'), postController.update);
router.delete('/:id', auth, postController.remove);

module.exports = router;
