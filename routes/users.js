const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//UPDATE
router.put('/:id', async (req, res) => {
  // Check whether user has logined or not
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // if client send request containing password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    // Update user data depending on request
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // update according to all within req.body
        },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('You can update only yout account!');
  }
});

//DELETE
router.delete('/:id', async (req, res) => {
  // Check whether user has logined or not
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // Delete user data depending on request
    try {
      const user = await User.findById(req.params.id);
      try {
        // delete user
        await User.findByIdAndDelete(req.params.id);
        res.json('User has been deleted');
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json('User not found!');
    }
  } else {
    res.status(401).json('You can delete only yout account!');
  }
});

//GET USER
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//FOLLOW USER
router.put('/:id/follow', async (req, res) => {
  // if the users who want to follow and be followed are NOT the same
  if (req.body.userId !== req.params.id) {
    try {
      // find target user and current user data
      const targetUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // check whether the current user has followed the target user or not
      if (!targetUser.followers.includes(req.body.userId)) {
        // add target user followers and current user followings
        await targetUser.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.json('you are following the target user');
      } else {
        res.status(403).json('you already followed the target user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('you cannot follow yourself');
  }
});

//UNFOLLOW USER
router.put('/:id/unfollow', async (req, res) => {
  // if the users who want to follow and be followed are NOT the same
  if (req.body.userId !== req.params.id) {
    try {
      // find target user and current user data
      const targetUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // check whether the current user has followed the target user or not
      if (targetUser.followers.includes(req.body.userId)) {
        // add target user followers and current user followings
        await targetUser.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.json('you unfollowed the target user');
      } else {
        res.status(403).json('you did not follow the target user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('you cannot unfollow yourself');
  }
});

module.exports = router;
