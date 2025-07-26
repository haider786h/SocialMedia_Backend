const models = require('../Model/index');

// Like a post
exports.likePost = async (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.body;

  try {
    const existingLike = await models.like.findOne({ where: { userId, postId } });

    if (existingLike) {
      // 🔁 Unlike it
      await existingLike.destroy();
      return res.status(200).json({ message: 'Post unliked' });
    }

    // ✅ Like it
    const newLike = await models.like.create({ userId, postId });
    res.status(201).json({ message: 'Post liked', like: newLike });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error toggling like' });
  }
};


// Get all likes for a post
exports.getLikesByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await models.like.findAll({
      where: { postId },
      include: { model: models.user, attributes: ['id', 'name'] }
    });

    res.json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching likes' });
  } 
};

// Check if current user liked the post
exports.checkIfLiked = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const like = await models.like.findOne({ where: { userId, postId } });

    if (like) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (err) {
    console.error('Error checking like:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

