import React from "react";
import packageJson from '../../package.json';

const Footer = () => {
  const year = new Date().getFullYear();
  return <footer className="app-footer">
    Workout Tracker v.{packageJson.version} Copyright © {year} Shalapuda Sergey
  </footer>
};

export default Footer;
