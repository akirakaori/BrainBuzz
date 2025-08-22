import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import MyInformation from "../../MyInformation";

export interface IAuthUserList {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  __v: number;
}

function AuthHomePage() {
  const [users, setUsers] = useState<IAuthUserList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { roleState } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    async function fetchData() {
      axios
        .get("/api/user/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const userList: IAuthUserList[] = response?.data?.users || [];
          setUsers(userList);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("error => ", error);
          // Remove the annoying alert and just log the error
          console.error("Failed to fetch user list:", error?.response?.data?.message || "An error occurred");
          setIsLoading(false);
        });
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
    <div>
      {/* Welcome Hero */}
      <section className="hero">
        <div className="container">
          <h1>Welcome Back to BrainBuxx!</h1>
          <p>
            Ready to continue your learning journey? Access your quizzes, 
            track your progress, and challenge yourself with new questions.
          </p>
          <div className="hero-actions">
            <Link to="/questionset/list" className="btn btn-primary btn-lg">
              Browse Quizzes
            </Link>
            {roleState === "admin" && (
              <Link to="/admin/questionset/create" className="btn btn-secondary btn-lg">
                Create New Quiz
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section style={{ padding: "var(--spacing-16) 0" }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Your Dashboard</h2>
            <p>Overview of your BrainBuxx activity</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">
                {roleState === "admin" ? "Total Users" : "Community Members"}
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">🎯</div>
              <div className="stat-label">Quizzes Available</div>
              <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                <Link to="/questionset/list" className="text-primary">View All →</Link>
              </p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">📈</div>
              <div className="stat-label">Your Progress</div>
              <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                <Link to="/profile" className="text-primary">View Profile →</Link>
              </p>
            </div>
            
            {roleState === "admin" && (
              <div className="stat-card">
                <div className="stat-number">⚙️</div>
                <div className="stat-label">Admin Tools</div>
                <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                  <Link to="/admin/questionset/create" className="text-primary">Create Quiz →</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Section */}
      {roleState === "admin" && (
        <section style={{ 
          background: "var(--bg-accent)", 
          padding: "var(--spacing-16) 0" 
        }}>
          <div className="container">
            <div className="text-center mb-8">
              <h2>Community Overview</h2>
              <p>Manage and view your BrainBuxx community</p>
            </div>
            
            <div className="quiz-grid">
              {users.slice(0, 6).map((user) => (
                <MyInformation
                  key={user._id}
                  id={user._id}
                  name={user.name}
                  email={user.email}
                />
              ))}
            </div>
            
            {users.length > 6 && (
              <div className="text-center mt-8">
                <p>And {users.length - 6} more users in your community</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section style={{ padding: "var(--spacing-16) 0" }}>
        <div className="container text-center">
          <h2>Quick Actions</h2>
          <p style={{ marginBottom: "var(--spacing-8)" }}>
            What would you like to do today?
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/questionset/list" className="btn btn-primary">
              Take a Quiz
            </Link>
            <Link to="/profile" className="btn btn-secondary">
              Update Profile
            </Link>
            {roleState === "admin" && (
              <Link to="/admin/questionset/create" className="btn btn-secondary">
                Create New Quiz
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthHomePage;
