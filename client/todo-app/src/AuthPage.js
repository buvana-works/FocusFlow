import { useState } from "react"; 
import Login from "./Login";
import Signup from "./SignUp";

const AuthPage = ({ setAuth }) => {
  const [activeTab, setActiveTab] = useState("login");


    return (<div className="auth-container">
        <div className="tab-buttons">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "login" ? (
            <Login setAuth={setAuth} />
          ) : (
            <Signup onSignupSuccess={() => setActiveTab("login")} />
          )}
        </div>
      </div>)

}

export default AuthPage;