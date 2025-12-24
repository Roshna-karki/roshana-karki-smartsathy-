const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    // Validation
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user via model
    const user = await User.createUser({ name, email, password: hashedPassword, companyName });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.company_name,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[Login] Attempting login for email:', email);

    // Validation
    if (!email || !password) {
      console.log('[Login] Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    console.log('[Login] Searching for user with email:', email);
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('[Login] User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log('[Login] User found:', { id: user.id, email: user.email, name: user.name });

    // Verify password
    console.log('[Login] Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('[Login] Password verification failed');
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log('[Login] Password verified successfully');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.company_name,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Check if it's a database connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === '28P01') {
      return res.status(500).json({ message: 'Database connection failed. Please check your database server.' });
    }
    
    // Check for other database errors
    if (error.code && error.code.startsWith('2')) {
      return res.status(500).json({ message: `Database error: ${error.message}` });
    }
    
    res.status(500).json({ message: `Server error during login: ${error.message}` });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: user.company_name,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};

