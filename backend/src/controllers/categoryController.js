const Category = require('../models/Category');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errs = validationResult(req); if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { name } = req.body;
    let cat = await Category.findOne({ name });
    if (cat) return res.status(400).json({ message: 'Category exists' });
    cat = new Category({ name });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) { next(err); }
};
