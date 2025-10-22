const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)+/g,'');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q, category } = req.query;
    const filter = {};
    if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { content: { $regex: q, $options: 'i' } }];
    if (category) filter.categories = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .skip(skip).limit(parseInt(limit));
    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('categories', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
    res.json({ post, comments });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errs = validationResult(req); if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });

    const { title, content, categories } = req.body;
    const featuredImage = req.file ? `/uploads/${req.file.filename}` : undefined;
    const post = new Post({
      title,
      slug: slugify(title),
      content,
      excerpt: content.slice(0, 200),
      author: req.user._id,
      categories: categories ? (Array.isArray(categories) ? categories : [categories]) : [],
      featuredImage
    });
    await post.save();
    const populated = await Post.findById(post._id).populate('author', 'name').populate('categories', 'name');
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const { title, content, categories } = req.body;
    if (title) { post.title = title; post.slug = slugify(title); }
    if (content) { post.content = content; post.excerpt = content.slice(0, 200); }
    if (categories) post.categories = Array.isArray(categories) ? categories : [categories];
    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;

    await post.save();
    const populated = await Post.findById(post._id).populate('author', 'name').populate('categories', 'name');
    res.json(populated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};
