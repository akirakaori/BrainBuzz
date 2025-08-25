import { Link } from "react-router-dom";

// Simple SVG icons for the features section. You can replace these with a library like react-icons if you prefer.
const InteractiveQuizIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

const ProgressTrackingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 .5-1.5m0 0l-2.25-2.25L12 3l2.25 2.25" />
    </svg>
);

const RoleBasedAccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.232-.656.328-1.003m-11.455 5.28c.67-1.32 1.86-2.292 3.286-2.678A7.5 7.5 0 109 9.75a7.5 7.5 0 00-6.463 3.428z" />
    </svg>
);

function UnAuthHomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding hero">
        <div className="container">
          <span className="section-subtitle">Welcome to BrainBuxx</span>
          <h1>Test Your Knowledge, Elevate Your Skills</h1>
          <p>
            Join thousands of learners on our comprehensive quiz platform. 
            Engage with interactive content, track your progress, and achieve your learning goals.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started for Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section (Styled like "Our Services") */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-light-gray)'}}>
        <div className="container">
          <div className="text-center">
            <span className="section-subtitle">Our Features</span>
            <h2 className="section-title">Why You'll Love BrainBuxx</h2>
            <p className="section-description">
              We've built a powerful platform with features designed to enhance your learning experience.
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-icon"><InteractiveQuizIcon /></div>
              <h3>Interactive Quizzes</h3>
              <p>Engage with dynamic questions designed to effectively test your knowledge.</p>
            </div>
            
            <div className="service-card">
              <div className="service-card-icon"><ProgressTrackingIcon /></div>
              <h3>Progress Tracking</h3>
              <p>Monitor your performance with detailed analytics and score history over time.</p>
            </div>
            
            <div className="service-card">
              <div className="service-card-icon"><RoleBasedAccessIcon /></div>
              <h3>For Everyone</h3>
              <p>Tailored experiences for students and administrators to manage and learn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Styled like "Our Work Process") */}
      <section className="section-padding">
        <div className="container">
            <div className="text-center">
                <span className="section-subtitle">How It Works</span>
                <h2 className="section-title">Your Journey in 4 Simple Steps</h2>
            </div>
            <div className="work-process-container" style={{ marginTop: 'var(--spacing-16)'}}>
                <div className="process-step">
                    <div className="step-icon-wrapper">01</div>
                    <h3>Sign Up</h3>
                    <p>Create your free account in just a few seconds.</p>
                </div>
                <div className="process-step">
                    <div className="step-icon-wrapper">02</div>
                    <h3>Browse Quizzes</h3>
                    <p>Explore our library of quizzes on various topics.</p>
                </div>
                <div className="process-step">
                    <div className="step-icon-wrapper">03</div>
                    <h3>Take the Test</h3>
                    <p>Challenge yourself and answer the questions.</p>
                </div>
                <div className="process-step">
                    <div className="step-icon-wrapper">04</div>
                    <h3>Get Results</h3>
                    <p>Receive instant feedback and track your score.</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding cta-section">
        <div className="container">
          <h2 className="section-title">Ready to Start Learning?</h2>
          <p className="section-description" style={{ fontSize: 'var(--font-size-lg)' }}>
            Join our community today and take the next step in your educational journey!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UnAuthHomePage;