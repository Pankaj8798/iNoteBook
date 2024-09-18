import './App.css';
import {
  Route,
  Routes,
} from "react-router-dom";

import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Alert from './components/Alert';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';

import NoteState from './context/notes/NoteState';
import AlertState from './context/alert/AlertState';
import UserState from './context/user/UserState';

// Middleware
import AuthGuard from './middleware/AuthGuard';
function App() {
  return (
    <>
      <AlertState>
        <UserState>
          <NoteState>
            <Header />
            <Alert />
            <div className="container my-3">
              <Routes>
                <Route exact path="/" element={<AuthGuard Component={Home} />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/change-password" element={<ChangePassword />} />
              </Routes>
            </div>
          </NoteState>
        </UserState>
      </AlertState>
    </>
  );
}

export default App;
