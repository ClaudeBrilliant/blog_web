const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  try {
    const errs = validationResult(req); if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    const { postId, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = new Comment({
      post: postId,
      authorName: req.user ? req.user.name : req.body.authorName,
      authorId: req.user ? req.user._id : undefined,
      content
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

exports.getByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { next(err); }
};
