const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req, res) => {
  try {
    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  try {
    // Find the data by username
    const validUser = await User.findOne({ username: req.body.username });
    if (!validUser) return res.status(400).json('wrong username or password');

    // Check whether password is correct or not
    const validPass = await bcrypt.compare(req.body.password, validUser.password);
    if (!validPass) return res.status(400).json('wrong username or password');

    // Send response containing user data without password
    const { password, ...others } = validUser._doc;
    res.json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
