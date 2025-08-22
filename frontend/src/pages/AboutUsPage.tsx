function AboutUsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>About QuizMaster Pro</h1>
          <p>
            Empowering learners worldwide with comprehensive quiz solutions 
            that make learning engaging, measurable, and effective.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: "var(--spacing-16) 0" }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Our Mission</h2>
            <p>Making knowledge assessment accessible and engaging for everyone</p>
          </div>
          
          <div className="quiz-grid">
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--spacing-4)" }}>
                  🎯
                </div>
                <h3>Accurate Assessment</h3>
                <p>
                  Precise evaluation of knowledge and skills through well-designed 
                  multiple-choice questions and comprehensive scoring systems.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--spacing-4)" }}>
                  🚀
                </div>
                <h3>Continuous Learning</h3>
                <p>
                  Foster a culture of continuous improvement through immediate 
                  feedback and progress tracking capabilities.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: "var(--font-size-4xl)", marginBottom: "var(--spacing-4)" }}>
                  🤝
                </div>
                <h3>Community Driven</h3>
                <p>
                  Building a supportive learning community where administrators 
                  and learners collaborate to achieve educational goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        background: "var(--bg-accent)", 
        padding: "var(--spacing-16) 0" 
      }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Platform Features</h2>
            <p>Everything you need for effective knowledge assessment</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">🔐</div>
              <div className="stat-label">Secure Authentication</div>
              <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                JWT-based security with role-based access control
              </p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">📊</div>
              <div className="stat-label">Real-time Scoring</div>
              <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                Instant feedback and comprehensive result analysis
              </p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">📱</div>
              <div className="stat-label">Responsive Design</div>
              <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                Seamless experience across all devices and screen sizes
              </p>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">⚙️</div>
              <div className="stat-label">Admin Controls</div>
              <p style={{ marginTop: "var(--spacing-2)", fontSize: "var(--font-size-sm)" }}>
                Powerful tools for creating and managing quiz content
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section style={{ padding: "var(--spacing-16) 0" }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Built with Modern Technology</h2>
            <p>Reliable, scalable, and performant technology stack</p>
          </div>
          
          <div className="quiz-grid">
            <div className="card">
              <div className="card-header">
                <h3>Frontend</h3>
              </div>
              <div className="card-body">
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>⚛️ React 19 with TypeScript</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>🎨 Modern CSS with Design System</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>🔄 React Router for Navigation</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>📋 React Hook Form</li>
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3>Backend</h3>
              </div>
              <div className="card-body">
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>🟢 Node.js with Express</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>🍃 MongoDB with Mongoose</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>🔐 JWT Authentication</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>🛡️ Security Middleware</li>
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3>Key Features</h3>
              </div>
              <div className="card-body">
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>✅ Role-based Access Control</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>📊 Automatic Scoring System</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>💾 Persistent Data Storage</li>
                  <li style={{ marginBottom: "var(--spacing-2)" }}>📱 Mobile-First Design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: "linear-gradient(135deg, var(--primary-green) 0%, var(--primary-green-dark) 100%)",
        color: "var(--text-light)",
        padding: "var(--spacing-16) 0" 
      }}>
        <div className="container text-center">
          <h2 style={{ color: "var(--text-light)" }}>Ready to Get Started?</h2>
          <p style={{ 
            color: "rgba(255, 255, 255, 0.9)", 
            fontSize: "var(--font-size-lg)",
            marginBottom: "var(--spacing-8)" 
          }}>
            Join QuizMaster Pro today and start your learning journey!
          </p>
          <div className="flex justify-center gap-4">
            <a href="/register" className="btn btn-primary btn-lg" style={{ background: "var(--text-light)", color: "var(--primary-green)" }}>
              Sign Up Now
            </a>
            <a href="/" className="btn btn-secondary btn-lg" style={{ borderColor: "var(--text-light)", color: "var(--text-light)" }}>
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
