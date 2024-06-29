import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getPostsByUserId } from '../Services/postService';

const AllPost = (props) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (user) {
          const postData = await getPostsByUserId(user._id);
          setPosts(postData);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user]);

  const handleShowPostClick = (postId) => {
    if (user) {
      navigate(`/main-post/${postId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Container>
      <Content>
        {posts.map((post) => (
          <Box key={post._id} onClick={() => handleShowPostClick(post._id)}>
            <img src={post.image} alt={post.title} />
            <div>
              <h1>
                Post
                <a>
                  <i className="bx bx-link-external"></i>
                </a>
              </h1>
            </div>
          </Box>
        ))}
      </Content>
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
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(3, minmax(0, 2fr));
  margin-bottom: 30px;


  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 2fr));
  }
  @media (max-width: 660px) {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 300px;
  border: 1px solid #222222;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    cursor: pointer;
    transition: 0.5s ease;
  }
  div {
    position: absolute;
    color: #fff;
    z-index: 10;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    height: 300px;
    bottom: 300px;
    cursor: pointer;
    transition: 0.5s ease;

    h1 {
      display: flex;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        text-decoration: none;
        color: #fff;
        margin-left: 8px;
      }
    }
  }

  &:hover {
    img {
      transform: scale(1.2);
    }
    div {
      bottom: 0%;
    }
  }
`;

export default AllPost;
