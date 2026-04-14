import React, { useState, useEffect } from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  // State for the epoch time in milliseconds
  const [epochTime, setEpochTime] = useState(Date.now());

  // Update time every 500ms as recommended
  useEffect(() => {
    const timer = setInterval(() => {
      setEpochTime(Date.now());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Mock user data for clean rendering
  const user = {
    name: "Alex Dev",
    bio: "Frontend Wizard in training. Passionate about semantic HTML, React state management, and building accessible, pixel-perfect user interfaces that work flawlessly across all devices.",
    avatar: "https://i.pravatar.cc/150?img=33",
    hobbies: ["Mechanical Keyboards", "Bouldering", "Open Source CSS"],
    dislikes: ["Spaghetti Code", "Missing Alt Text", "Merge Conflicts"],
    socials: [
      { network: "github", label: "GitHub", url: "https://github.com" },
      { network: "twitter", label: "Twitter", url: "https://twitter.com" },
      { network: "linkedin", label: "LinkedIn", url: "https://linkedin.com" }
    ]
  };

  return (
    <article data-testid="test-profile-card" className="profile-card">
      <header className="profile-header">
        <figure className="profile-figure">
          <img 
            src={user.avatar} 
            alt={`Profile avatar of ${user.name}`} 
            data-testid="test-user-avatar" 
            className="profile-avatar"
          />
        </figure>
        <div className="profile-headline">
          <h2 data-testid="test-user-name" className="profile-name">{user.name}</h2>
          <p data-testid="test-user-bio" className="profile-bio">{user.bio}</p>
        </div>
      </header>

      {/* Live Time Display with aria-live for screen readers */}
      <div className="profile-time-container" aria-live="polite">
        <span className="time-label">Current System Time (ms):</span>
        <span data-testid="test-user-time" className="time-value">{epochTime}</span>
      </div>

      <div className="profile-lists">
        <section className="list-section">
          <h3 className="section-title">Hobbies</h3>
          <ul data-testid="test-user-hobbies" className="profile-list">
            {user.hobbies.map((hobby, index) => (
              <li key={index} className="list-item">{hobby}</li>
            ))}
          </ul>
        </section>

        <section className="list-section">
          <h3 className="section-title">Dislikes</h3>
          <ul data-testid="test-user-dislikes" className="profile-list dislikes">
            {user.dislikes.map((dislike, index) => (
              <li key={index} className="list-item">{dislike}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Semantic navigation for external links */}
      <nav aria-label="Social media links" className="profile-nav">
        <ul data-testid="test-user-social-links" className="social-links">
          {user.socials.map((social) => (
            <li key={social.network}>
              <a 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                data-testid={`test-user-social-${social.network}`}
                className="social-link"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
};

export default ProfileCard;