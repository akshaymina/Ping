// client/src/App.jsx
import {Routes, Route, Link} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/Profile";


function App() {
  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "space-around", gap: "40px", margin: "50px" }}>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
