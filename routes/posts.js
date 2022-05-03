const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//CREATE A POST
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE A POST
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body, // update according to all within req.body
          },
          { new: true }
        );
        res.json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status.apply(403).json('you can only edit your own post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE A POST
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.json('the post has been deleted');
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status.apply(403).json('you can only delete your own post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//LIKE & UNLIKE A POST
router.put('/:id/like', async (req, res) => {
  try {
    // find the post data
    const post = await Post.findById(req.params.id);
    // check whether the user has liked the post or not
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.json('you like the post');
    } else {
      // unlike the post
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.json('you unlike the post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET A POST
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TIMELINE POSTS
router.post('/timeline', async (req, res) => {
  try {
    // Find the user data and check its followings
    const user = await User.findById(req.body.userId);
    // Merge following's id(s) with the user id
    let allIds = [];
    user.followings.forEach((e) => {
      allIds.push(e);
    });
    allIds.push(req.body.userId);
    // Find following posts and our own posts
    const posts = await Post.find({ userId: { $in: allIds } });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET OWN POSTS
router.post('/profile', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.body.userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
