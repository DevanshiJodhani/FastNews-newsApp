import axios from '../axios.js';
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext.jsx';
import Alert from './Alert.jsx';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
        { email, password }
      );
      setUser(res.data.data.user);
      setAlert({
        message: 'Successfully logged in!',
        isOpen: true,
        redirectTo: '/',
      });
    } catch (error) {
      setAlert({ message: 'Login failed. Please try again.', isOpen: true });
      console.error(error.message);
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
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="">Forgot Password?</a>
          <button type="submit">Login</button>
        </Form>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 150px 20px;
`;

const Content = styled.div`
  width: 500px;
  height: auto;
  background: #fff;
  color: #000;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 35px;
    margin-bottom: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  input {
    margin-bottom: 15px;
    width: 100%;
    height: 50px;
    padding: 8px;
    font-size: 16px;
    color: #000;
    outline: none;
    border: 2px solid #aaa;
    border-radius: 10px;
    &:focus {
      border: 2px solid #000;
    }
  }
  a {
    width: 30%;
    margin-bottom: 10px;
    color: #000;
    text-decoration: none;
    padding: 5px;

    &:hover {
      text-decoration: underline;
      color: #ff0000;
    }
  }

  button {
    width: 40%;
    padding: 16px 30px;
    font-size: 18px;
    font-weight: 600;
    border-radius: 10px;
    background: #007bff;
    color: #fff;
    outline: none;
    border: none;
    cursor: pointer;
    &:hover {
      background: #0056b3;
    }
  }
  @media screen and (max-width: 500px) {
    a {
      width: 100%;
    }
    button {
      width: 100%;
    }
  }
`;

export default Login;
