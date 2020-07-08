import React from "react";
import packageJson from '../../package.json';

const Footer = () => {
  const year = (new Date()).getFullYear();
  return <footer className="app-footer">
    Workout Tracker v.{packageJson.version} © {year}
  </footer>
};

export default Footer;
