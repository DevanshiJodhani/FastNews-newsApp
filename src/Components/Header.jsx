import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const Header = (props) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('/api/v1/users/logout');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Container>
      <Content>
        <Logo >
          <a href='/'>
            Fast<span>News.</span>
          </a>
        </Logo>
        <NavLinks>
          <input type="checkbox" id="click" />
          <label htmlFor="click" className="menu-btn">
            <ion-icon name="menu-outline"></ion-icon>
            <ion-icon name="close-outline"></ion-icon>
          </label>
          <ul>
            <li>
              {!user ? (
                <>
                  <a href="/login">Login</a>
                  <a href="/signup">Sign Up</a>
                </>
              ) : (
                <>
                  {user.role === 'admin' && (
                    <>
                      <a href="/allpost">All Post</a>
                      <a href="/createpost">Create Post</a>
                    </>
                  )}
                  <a href="#" onClick={handleLogout}>
                    Logout
                  </a>
                  <a href="/my-account">{user.name}</a>
                </>
              )}
            </li>
          </ul>
        </NavLinks>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #000;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid #ffffff53;
  z-index: 100;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 80px;
  align-items: center;

  @media screen and (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Logo = styled.div`
  a {
    text-decoration: none;
    font-size: 30px;
    letter-spacing: 1px;
    color: #ededed;
    cursor: pointer;

    span {
      font-size: 25px;
      color: #c6c4c4;
    }
  }
  @media screen and (max-width: 768px) {
    a {
      font-size: 25px;
      span {
        font-size: 20px;
      }
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ul {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        text-decoration: none;
        padding: 5px 20px;
        margin-left: 20px;
        font-size: 18px;
        color: #fff;
        transition: 0.5s ease;

        &:hover {
          color: #c6c6c6;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    ul {
      position: fixed;
      top: 70px;
      left: -100%;
      background: #0c0c0c;
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: right;
      padding: 20px;
      transition: all 0.4s ease;

      li {
        flex-direction: column;
        text-align: right;
        margin: 20px 0;
        text-align: right;

        a {
          padding: 20px;
          font-size: 22px;
          display: block;
        }
      }
    }
  }
`;

export default Header;
