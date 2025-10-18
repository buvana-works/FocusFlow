import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";        
import TodoApp from "./TodoPage";
import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import { FaSignOutAlt } from 'react-icons/fa';

function Navbar({ token, onLogout }) {
  return (
    <nav style={{ padding: "16px", background: "#6C63FF", color: "#fff", display: "flex", gap: "24px" }}>
        {token && (
        <div>

        {/* <button
          style={{
            marginLeft: "auto",
            background: "#43E6D6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: "pointer"
          }} */}
          
           <FaSignOutAlt onClick={onLogout} />
     
</div> )
}
    </nav>
  );
}

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("accessToken"));
   const navigate = useNavigate();

   console.log("token fetched", token)

    const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <div>
      <Navbar token={token} onLogout={handleLogout}/>
      <Routes>
        <Route path="/todo" element={ <TodoApp /> } />
        <Route path="/login" element={<AuthPage setAuth={setToken} />} />
        <Route path="*" element={<Navigate to={token ? "/todo" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;