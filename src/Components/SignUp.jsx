import axios from '../axios.js';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Alert from './Alert';
import { UserContext } from '../context/UserContext';

const SignUp = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });

  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        setAlert({ message: 'Passwords do not match', isOpen: true });
        return;
      }

      // Set default role if not provided
      const formDataWithRole = {
        ...formData,
        role: formData.role || 'user',
      };

      const response = await axios.post(
        '/api/v1/users/signup',
        formDataWithRole
      );

      setUser(response.data.data.user);
      setAlert({
        message: 'Signup successful!',
        isOpen: true,
        redirectTo: '/',
      });
    } catch (error) {
      setAlert({
        message: `Signup failed. ${
          error.response ? error.response.data.message : 'Please try again.'
        }`,
        isOpen: true,
      });
      console.error('Signup failed:', error);
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
        <h1>Sign Up</h1>
        <Form onSubmit={handleSubmit}>
          <input
            type="name"
            placeholder="John Leo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="********"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="********"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            password
            required
          />
          <input
            type="text"
            placeholder="i.g.,user or admin"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
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
    button {
      width: 100%;
    }
  }
`;

export default SignUp;
