import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import MyInformation from "../../MyInformation";

export interface IAuthUserList {
  _id: string;
  name: string;
  email: string;
}

function AuthHomePage() {
  const [users, setUsers] = useState<IAuthUserList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { roleState } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    async function fetchData() {
      try {
        const response = await axios.get("/api/user/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userList: IAuthUserList[] = response?.data?.users || [];
        setUsers(userList);
      } catch (error) {
        console.error("Failed to fetch user list:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 style={{ color: "lavender" }}>Welcome Back!</h1>
          <p>Here's a quick overview of your activity and available actions.</p>
        </div>

        {/* Dashboard Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">
                {roleState === "admin" ? "Total Users" : "Community Members"}
            </div>
            <div className="stat-number">{users.length}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Quizzes Available</div>
            <div className="stat-number">🚀</div>
            <Link to="/questionset/list" style={{ marginTop: 'var(--spacing-4)', display: 'inline-block' }}>View All Quizzes →</Link>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Your Profile</div>
            <div className="stat-number">👤</div>
            <Link to="/profile" style={{ marginTop: 'var(--spacing-4)', display: 'inline-block' }}>View Your Progress →</Link>
          </div>
          
          {roleState === "admin" && (
            <div className="stat-card">
              <div className="stat-label">Admin Tools</div>
              <div className="stat-number">⚙️</div>
              <Link to="/admin/questionset/create" style={{ marginTop: 'var(--spacing-4)', display: 'inline-block' }}>Create a New Quiz →</Link>
            </div>
          )}
        </div>

        {/* Community Section (Admin Only) */}
        {roleState === "admin" && users.length > 0 && (
          <div style={{ marginTop: 'var(--spacing-20)'}}>
            <div className="text-center">
              <h2 className="section-title">Community Overview</h2>
              <p className="section-description">
                A snapshot of the most recent users who have joined the platform.
              </p>
            </div>
            
            <div className="stats-grid">
              {users.slice(0, 8).map((user) => (
                <MyInformation
                  key={user._id}
                  id={user._id}
                  name={user.name}
                  email={user.email}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthHomePage;