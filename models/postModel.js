import mongoose from 'mongoose';

const postschema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post must have a title!'],
    unique: true,
  },
  image: {
    type: String,
    required: [true, 'A post must have a image!'],
  },
  highlight: {
    type: String,
    required: [true, 'A post must have a highlight!'],
  },
  description: {
    type: String,
    required: [true, 'A post must have a description!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A post must belong to a user'],
  },
});

const MainPost = mongoose.model('MainPost', postschema);

export default MainPost;
