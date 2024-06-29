import express from 'express';
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  getPostsByUserId,
  updatePost,
  uploadPostImage,
} from '../controller/postController.js';

const router = express.Router();

router.post('/create-post', uploadPostImage, createPost);
router.get('/all-post', getAllPost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

router.get('/user-posts/:userId', getPostsByUserId);

export default router;

