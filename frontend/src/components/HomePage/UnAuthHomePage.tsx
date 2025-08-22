import { Link } from "react-router-dom";

function UnAuthHomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to BrainBuxx</h1>
          <p>
            Test your knowledge, track your progress, and compete with others 
            in our comprehensive quiz platform. Join thousands of learners 
            improving their skills every day.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "var(--spacing-16) 0" }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Why Choose BrainBuxx?</h2>
            <p>Powerful features designed to enhance your learning experience</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">🎯</div>
              <h3>Interactive Quizzes</h3>
              <p>Engage with dynamic, multi-choice questions designed to test your knowledge effectively.</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your performance with detailed analytics and score tracking over time.</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">👥</div>
              <h3>Role-Based Access</h3>
              <p>Separate interfaces for students and administrators with tailored features for each role.</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">⚡</div>
              <h3>Instant Results</h3>
              <p>Get immediate feedback on your performance with detailed explanations for each answer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: "var(--bg-accent)", 
        padding: "var(--spacing-16) 0" 
      }}>
        <div className="container text-center">
          <h2>Ready to Start Learning?</h2>
          <p style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--spacing-8)" }}>
            Join our community and start taking quizzes today!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Account
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UnAuthHomePage;
