const passport = require('passport');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user,
      });
    }
    req.login(user, { session: false }, () => {
      if (err) {
        return res.json(err);
      }

      const token = jwt.sign(user, 'Your_Own_jWt_SeCrEt');
      return res.json({ user, token });
    });
  })(req, res);
}

const getStatus = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false,
    });
  }
  return res.status(200).json({
    status: true,
  });
}

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

const removeAccount = () => {}

module.exports = {
  getStatus,
  login,
  logout,
  removeAccount,
};