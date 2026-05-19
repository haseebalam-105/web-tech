const bcrypt = require('bcryptjs');
const User   = require('../models/User');

// GET /register
exports.getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/register', {
    title: 'Register',
    old:   JSON.parse(req.flash('old')[0] || '{}'),
  });
};

// POST /register
exports.postRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  req.flash('old', JSON.stringify({ name, email }));

  if (!name || name.trim() === '')        { req.flash('error', 'Name is required.');                       return res.redirect('/register'); }
  if (!email || email.trim() === '')      { req.flash('error', 'Email is required.');                      return res.redirect('/register'); }
  if (!password || password.length < 6)  { req.flash('error', 'Password must be at least 6 characters.'); return res.redirect('/register'); }
  if (password !== confirmPassword)       { req.flash('error', 'Passwords do not match.');                 return res.redirect('/register'); }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) { req.flash('error', 'An account with that email already exists.'); return res.redirect('/register'); }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed, role: 'customer' });

    req.flash('success', 'Account created! Please log in.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
};

// GET /login
exports.getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/login', {
    title: 'Login',
    old:   JSON.parse(req.flash('old')[0] || '{}'),
  });
};

// POST /login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  req.flash('old', JSON.stringify({ email }));

  if (!email || !password) { req.flash('error', 'Email and password are required.'); return res.redirect('/login'); }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) { req.flash('error', 'Invalid email or password.'); return res.redirect('/login'); }

    const match = await bcrypt.compare(password, user.password);
    if (!match) { req.flash('error', 'Invalid email or password.'); return res.redirect('/login'); }

    // Set session
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    return user.role === 'admin' ? res.redirect('/admin') : res.redirect('/');
  } catch (err) {
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
};

// GET /logout
exports.getLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

// GET /profile  (protected by isLoggedIn in routes)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) return req.session.destroy(() => res.redirect('/login'));
    res.render('auth/profile', { title: 'My Profile', user });
  } catch (err) {
    res.redirect('/');
  }
};
