const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/categoryController');
const { categoryValidator } = require('../validators/validators');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.post('/', auth, categoryValidator, create);

module.exports = router;
