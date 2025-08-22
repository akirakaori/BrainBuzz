import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(""); // Clear error when user types
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const finalData = {
      email,
      password,
    };

    try {
      const response = await axios.post("/api/user/login", finalData);
      const token = response.data.accessToken;
      const user = response.data.user;
      
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      window.location.href = "/";
    } catch (error: any) {
      console.log("error => ", error);
      const errorMessage = error?.response?.data?.message || "An error occurred during login";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your BrainBuxx account</p>
        </div>
        
        <div className="auth-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary-green)", fontWeight: "600" }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
