import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Alert from './Alert.jsx';
import axios from '../axios.js';
import { UserContext } from '../context/UserContext.jsx';

const MyAccount = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [alert, setAlert] = useState({
    message: '',
    isOpen: false,
    redirectTo: null,
  });

  const { setUser } = useContext(UserContext);

  const updateDetails = async () => {
    try {
      const updatedFields = {};
      if (email !== '') updatedFields.email = email;
      if (name !== '') updatedFields.name = name;
      if (role !== '') updatedFields.role = role;

      const response = await axios.patch(
        '/api/v1/users/updateMe',
        updatedFields
      );
      console.log('Updated user', response.data.data.user);
      setAlert({
        message: 'Details updated successfully!',
        isOpen: true,
      });

      // Reset input fields after successful update
      setEmail('');
      setName('');
      setRole('');
    } catch (error) {
      console.error('Update failed:', error.response.data.message);
      setAlert({ message: 'Update failed. Please try again.', isOpen: true });
    }
  };

  const updatePassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error("New passwords don't match. Please check again.");
      }

      const response = await axios.patch('/api/v1/users/updatePassword', {
        currentPassword,
        newPassword,
      });
      console.log('Password updated successfully');
      setAlert({
        message: 'Password updated successfully!',
        isOpen: true,
      });

      // Reset input fields after successful password update
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Password update failed:', error.message);
      setAlert({
        message: error.message || 'Password update failed. Please try again.',
        isOpen: true,
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.delete('/api/v1/users/deleteMe');
      console.log('Account deleted successfully');

      // Logout the user
      await axios.get('/api/v1/users/logout');

      // setuser null
      setUser(null);

      // Redirect to the login page
      setAlert({
        message: 'Your account has been deleted successfully!',
        isOpen: true,
        redirectTo: '/',
      });
    } catch (error) {
      console.error('Account deletion failed:', error.response.data.message);
      setAlert({
        message: 'Account deletion failed. Please try again.',
        isOpen: true,
      });
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
        <h1>My Account</h1>
        <UpdateEmail>
          <h2>Update email, userame or role</h2>
          <input
            type="email"
            placeholder="you@examle.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="John leo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button onClick={updateDetails}>Update</button>
        </UpdateEmail>
        <UpdatePassword>
          <h2>Update Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button onClick={updatePassword}>Update</button>
        </UpdatePassword>
        <DeleteAccount>
          <p>
            Delete Your Account
            <button type="submit" onClick={deleteAccount}>
              Delete
            </button>
          </p>
        </DeleteAccount>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 120px 400px;

  @media screen and (max-width: 990px) {
    padding: 120px 100px;
  }
  @media screen and (max-width: 768px) {
    padding: 120px 50px;
  }
  @media screen and (max-width: 500px) {
    padding: 120px 10px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  background: #44444448;
  padding: 40px;
  border-radius: 10px;
  h1 {
    margin-bottom: 40px;
  }
  @media screen and (max-width: 500px) {
    padding: 20px;
  }
`;

const UpdateEmail = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: #fff;
  max-width: 600px;
  width: 100%;
  border-radius: 10px;

  h2 {
    color: #000;
    margin-bottom: 20px;
  }

  input {
    width: 100%;
    height: 50px;
    border: 1px solid #aaa;
    outline: none;
    padding: 8px;
    font-size: 16px;
    font-weight: 900;
    border-radius: 5px;
    background: transparent;
    color: #4d4d4d;
    margin-bottom: 20px;
  }
  button {
    padding: 16px 30px;
    border: none;
    width: 30%;
    text-align: center;
    font-size: 16px;
    font-weight: 900;
    text-decoration: none;
    border-radius: 5px;
    background: #007bff;
    cursor: pointer;
    color: #fff;
    &:hover {
      background: #0056b3;
    }
  }
  @media screen and (max-width: 550px) {
    a {
      width: 100%;
    }
  }
`;

const UpdatePassword = styled(UpdateEmail)`
  margin-top: 30px;
`;

const DeleteAccount = styled.div`
  margin-top: 50px;
  p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;

    button {
      margin-left: 10px;
      padding: 16px 30px;
      border: 1px solid #ff0000;
      text-align: center;
      font-size: 16px;
      font-weight: 900;
      text-decoration: none;
      border-radius: 5px;
      background: #ff0000;
      color: #fff;
      letter-spacing: 1px;
      cursor: pointer;
      &:hover {
        background: #fc1b1b;
      }
    }
  }
`;

export default MyAccount;
