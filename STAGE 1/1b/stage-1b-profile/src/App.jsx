import React from 'react';
import ProfileCard from './ProfileCard';

function App() {
  return (
    // This inline style centers the card on the screen nicely for presentation
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem',
      backgroundColor: '#121218' // A dark background to match the card theme
    }}>
      <ProfileCard />
    </div>
  );
}

export default App;