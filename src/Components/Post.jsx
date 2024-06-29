import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePostById, getPostById } from '../Services/postService';
import { UserContext } from '../context/UserContext';
import Alert from './Alert';

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(postId);
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  const handleDelete = async () => {
    try {
      await deletePostById(postId);
      setAlert({
        message: 'Post deleted successfully !',
        isOpen: true,
        redirectTo: '/',
      });
    } catch (error) {
      setAlert({
        message: 'Unable to delete Post! Please try again later.',
        isOpen: true,
      });
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Container>
      {alert.isOpen && (
        <Alert
          message={alert.message}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          redirectTo={alert.redirectTo}
        />
      )}
      <Content>
        <ImgBox>
          <img src={post.image} alt={post.title} />
        </ImgBox>
        <Heading>
          <h1>{post.title}</h1>
        </Heading>
        <Description>{post.description}</Description>
        <SocialLinks>
          <li>
            <i className="bx bxl-github"></i>
          </li>
          <li>
            <i className="bx bxl-linkedin-square"></i>
          </li>
          <li>
            <i className="bx bxl-twitter"></i>
          </li>
          <li>
            <i className="bx bxl-instagram-alt"></i>
          </li>
          <li>
            <i className="bx bxl-facebook-circle"></i>
          </li>
        </SocialLinks>
        {user && user.role === 'admin' && (
          <AdminBtn>
            {/* <button type="submit">Update</button> */}
            <button type="submit" className="delete" onClick={handleDelete}>
              Delete
            </button>
          </AdminBtn>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 100px 50px;

  @media screen and (max-width: 768px) {
    padding: 100px 20px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #44444448;
  border-radius: 10px;
  overflow: hidden;
`;

const ImgBox = styled.div`
  position: relative;
  max-width: 100%;
  width: 100%;
  height: 700px;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0% 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom right, rgb(106, 79, 79), rgb(0, 0, 0)),
      url('./images/news.jpg');
    background-size: cover;
    background-position: center;
    mix-blend-mode: overlay;
  }
`;

const Heading = styled.div`
  margin-top: 20px;
  padding: 10px;
  h1 {
    font-size: 40px;
    color: #c5c4c4;
  }
  @media screen and (max-width: 768px) {
    h1 {
      font-size: 25px;
    }
  }
`;

const Description = styled.p`
  padding: 50px;
  text-align: left;
  font-size: 16px;
  line-height: 1.5;

  @media screen and (max-width: 768px) {
    padding: 30px;
    font-size: 15px;
  }

  @media screen and (max-width: 500px) {
    padding: 10px;
    font-size: 14px;
    line-height: 1.2;
  }
`;

const SocialLinks = styled.div`
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;

  li {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.5s ease;

    i {
      transition: 0.5s ease;
      font-size: 24px;
    }
    &:hover {
      background-color: #fff;

      i {
        color: #000;
      }
    }
  }

  @media screen and (max-width: 990px) {
    width: 50%;
  }

  @media screen and (max-width: 768px) {
    width: 60%;
  }
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;

const AdminBtn = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: right;
  align-items: flex-end;
  button {
    padding: 12px 30px;
    margin-left: 40px;
    border: none;
    outline: none;
    font-size: 18px;
    color: #fff;
    font-weight: 900;
    border-radius: 10px;
    background: #007bff;
    cursor: pointer;
    &:hover {
      background: #0056b3;
    }
  }
  .delete {
    background: #ff0000;

    &:hover {
      background: #fc1b1b;
    }
  }
`;

export default Post;
