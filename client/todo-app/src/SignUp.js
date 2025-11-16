import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        email,
        password,
      });

      alert(res.data.message);
      onSignupSuccess(); // e.g. redirect to login page
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSignup}>
      <h2 className="login-header">Sign Up</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
