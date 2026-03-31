import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      Workout Tracker v.0.2.0 &copy; {year} Shalapuda Sergey
    </footer>
  );
};

export default Footer;
