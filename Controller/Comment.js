const models = require('../Model/index');

//  Create Comment
exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.userId; // from auth middleware

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if post exists
    const post = await models.post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await models.comment.create({
      content,
      userId,
      postId
    });

    res.status(201).json({ message: 'Comment created', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

//  Get Comments by Post ID
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

  // GET comments with associated user
const comments = await models.comment.findAll({
  where: { postId },
  include: [
    {
      model: models.user,
      attributes: ['id', 'name']
    }
  ],
  order: [['createdAt', 'ASC']]
});

// console.log("📥 Comments fetched with users:", comments); // Debug log
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};
