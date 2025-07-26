const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../Model/index'); 
const JWT_SECRET = process.env.JWT_SECRET;

// 🟢 Register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await models.user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await models.user.create({
      name,
      email,
      password: hashedPassword,
      profileImage: "" 
    });

    res.status(201).json({  
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "" 
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
};

// 🔐 Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await models.user.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token , user: { id : user.id , name : user.name}} );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed', message: err.message });
  }
};

//  Get profile (protected route)
const getProfile = async (req, res) => {
  try {
    const user = await models.user.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
