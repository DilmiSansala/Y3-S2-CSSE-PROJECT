import React from "react";
import "./footer.css"; 
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <div className="links-container">
            <a href="/about">About Us</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: info@ecowaste.com</p>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Address: 123 Green Street, Eco City, Earth</p>
        </div>
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Eco Waste Management | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;