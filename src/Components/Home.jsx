import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getHomePosts } from '../Services/postService';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getHomePosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleShowPostClick = (postId) => {
    if (user) {
      navigate(`/main-post/${postId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Container>
      {posts.map((post) => (
        <Content key={post._id}>
          <ImgBox>
            <img src={post.image} alt={post.title} />
          </ImgBox>
          <Info>
            <h1>{post.title}</h1>
            <p>{post.highlight}</p>
            <a onClick={() => handleShowPostClick(post._id)}>Show Post</a>
          </Info>
        </Content>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 150px;

  @media screen and (max-width: 900px) {
    padding: 80px;
  }

  @media screen and (max-width: 500px) {
    padding: 0;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 30px;

  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width: 500px) {
    margin-top: 100px;
  }
`;

const ImgBox = styled.div`
  width: 40%;
  height: 300px;
  border: 1px solid #222222;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: 0.5s ease;
  }
  &:hover {
    img {
      transform: scale(1.2);
    }
  }
  @media screen and (max-width: 900px) {
    width: 500px;
  }

  @media screen and (max-width: 500px) {
    width: 300px;
    height: 200px;
  }
`;

const Info = styled.div`
  width: 60%;
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  padding: 30px;

  h1 {
    text-transform: uppercase;
    color: #aaa;
    font-size: 35px;
    margin-bottom: 20px;
  }

  p {
    color: #ededed;
    line-height: 1.5;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  a {
    padding: 16px 30px;
    width: 40%;
    font-size: 16px;
    font-weight: 900;
    border-radius: 10px;
    color: #000;
    border: 1px solid #fff;
    background-color: #fff;
    text-align: center;
    outline: none;
    cursor: pointer;
    transition: 0.5s;
    text-decoration: none;

    &:hover {
      background: transparent;
      color: #fff;
      border: 1px solid #fff;
    }
  }

  @media screen and (max-width: 500px) {
    width: 85%;
    padding: 20px;
    h1{
      font-size: 25px;
    }
    p {
      font-size: 14px;
      line-height: 1.2;
    }
    a {
      width: 80%;
    }
  }
`;

export default Home;
