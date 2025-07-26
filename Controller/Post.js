const models = require('../Model/index');

//  Create a Post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const image = req.file?.path || null;

    const post = await models.post.create({
      content,
      userId,
      image
    });

    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    console.error("❌ POST CREATE ERROR:", err);
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

//  Get All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 18 ;
    const offset = (page - 1) * limit;

    // ✅ Await the count
    const totalPosts = await models.post.count();
    const totalPages = Math.ceil(totalPosts / limit); // round up for any remaining posts

    const posts = await models.post.findAll({
      include: [
        {
          model: models.user,
          attributes: ['id', 'name', 'profileImage']
        },
        {
          model: models.like,
          include: {
            model: models.user,
            attributes: ['id', 'name']
          }
        },
        {
          model: models.comment,
          include: {
            model: models.user,
            attributes: ['id', 'name']
          }
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({ totalPages, totalPosts, posts, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get Post By id
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await models.post.findOne({
      where: { id },
      include: [
        {
          model: models.user,
          attributes: ['id', 'name', 'profileImage']
        },
        {
          model: models.like,
          include: {
            model: models.user,
            attributes: ['id', 'name']
          }
        },
        {
          model: models.comment,
          include: {
            model: models.user,
            attributes: ['id', 'name']
          }
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
