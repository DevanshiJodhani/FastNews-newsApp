import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Post from './Components/Post';
import Footer from './Components/Footer';
import MyAccount from './Components/MyAccount';
import CreatePost from './Components/CreatePost';
import AllPost from './Components/AllPost';

function App() {
  return (
    <div>
      <Router>
        <UserProvider>
          <Header />
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/main-post/:postId" element={<Post />} />
            <Route exact path="/my-account" element={<MyAccount />} />
            <Route exact path="/createpost" element={<CreatePost />} />
            <Route exact path="/allpost" element={<AllPost />} />
          </Routes>
          <Footer />
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
