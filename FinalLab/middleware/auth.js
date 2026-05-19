// isLoggedIn — blocks guests from protected routes
function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please log in to access that page.');
  res.redirect('/login');
}

// isAdmin — blocks non-admin users from admin routes
function isAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.userRole === 'admin') return next();
  req.flash('error', 'Access Denied. Admins only.');
  res.redirect('/');
}

module.exports = { isLoggedIn, isAdmin };
