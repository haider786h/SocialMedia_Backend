const User = require('../Model/User');

const uploadProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const imageUrl = req.file.path;
  
      // Save image URL to DB
      await User.update(
        { profileImage: imageUrl },
        { where: { id: userId } }
      );
  
      return res.json({ message: 'Profile image uploaded', imageUrl });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
  };
  
  const getProfile = async (req, res) => {
    try {
      const userId = req.user.userId; 
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'profileImage']
      });
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to get profile' });
    }
  };
  
module.exports = {
  uploadProfile,
  getProfile
};
