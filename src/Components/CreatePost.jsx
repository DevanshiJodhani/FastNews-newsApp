import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import axios from '../axios.js';
import Alert from './Alert.jsx';
import { UserContext } from '../context/UserContext.jsx';

const CreatePost = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: '',
    highlight: '',
    description: '',
    image: null,
  });

  const [showAlert, setShowAlert] = useState({
    message: '',
    isOpen: false,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('highlight', formData.highlight);
      postData.append('description', formData.description);
      postData.append('image', formData.image);
      postData.append('user', user._id);

      const response = await axios.post('/api/v1/posts/create-post', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowAlert({
        message: 'Post created successfully!',
        isOpen: true,
      });

      // Reset form fields
      setFormData({
        title: '',
        highlight: '',
        description: '',
        image: null,
      });
    } catch (error) {
      setShowAlert({
        message: 'Failed to create post. Please try again.',
        isOpen: true,
      });
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container>
      {showAlert.isOpen && (
        <Alert
          message={showAlert.message}
          onClose={() => setShowAlert({ message: '', isOpen: false })}
        />
      )}
      <Content>
        <h2>Create Post</h2>
        <Form onSubmit={handleSubmit}>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <Label>Highlight</Label>
          <TextArea
            name="highlight"
            placeholder="highlight"
            value={formData.highlight}
            onChange={handleInputChange}
          />

          <Label>Description</Label>
          <TextArea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Label>Featured Image</Label>
          <Input
            type="file"
            name="image"
            accept="image/png, image/jpg, image/jpeg"
            onChange={handleInputChange}
          />

          <ImagePreview>
            {formData.image && (
              <img src={URL.createObjectURL(formData.image)} alt="Preview" />
            )}
          </ImagePreview>
          <SubmitButton type="submit">Create Post</SubmitButton>
        </Form>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 120px 100px;

  @media screen and (max-width: 550px) {
    padding: 100px 50px;
  }
  @media screen and (max-width: 400px) {
    padding: 100px 20px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: #ffffff;
  color: #000;
  border-radius: 10px;

  h2 {
    color: #797979;
  }

  @media screen and (max-width: 500px) {
    align-items: center;
  }
`;

const Form = styled.form`
  flex: 1;
  padding: 20px;
  min-width: 300px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  height: 150px;
`;

const ImagePreview = styled.div`
  margin-bottom: 15px;
  color: #000;
  img {
    width: 100%;
    border-radius: 4px;
  }
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default CreatePost;
