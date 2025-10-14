import React, { useState } from "react";
import "./NonRegisteredHomeStyles.css";
import Logo from "../images/leaf.png";
import SliderImage1 from "../images/slider1.jpeg";
import SliderImage2 from "../images/slider2.jpeg";
import SliderImage5 from "../images/colouredbins.jpg";

// Import icons
import ReduceIcon from "../images/footprint.jpg";
import ConserveIcon from "../images/recycle-right.png";
import SupportIcon from "../images/landfill.jpg";
import SaveMoneyIcon from "../images/garbage-collect.jpg";

const NonRegisteredHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: SliderImage5,
      title: "Eco-Friendly Waste Management",
      description: "Discover our services and how we manage waste to keep our planet clean and green.",
    },
    {
      image: SliderImage1,
      title: "Join the Zero Waste Movement",
      description: "Become part of the solution. Reduce, Reuse, Recycle, and help create a sustainable future.",
    },
    {
      image: SliderImage2,
      title: "Recycle More, Waste Less",
      description: "Explore ways you can reduce your waste footprint with our tips and resources.",
    },
  ];

  const benefits = [
    {
      icon: ReduceIcon,
      alt: "Reduce Pollution Icon",
      title: "Reduce Pollution",
      description: "By managing waste responsibly, you can help reduce harmful emissions and pollution.",
    },
    {
      icon: ConserveIcon,
      alt: "Conserve Resources Icon",
      title: "Conserve Resources",
      description: "Recycling and reusing materials conserves natural resources for future generations.",
    },
    {
      icon: SupportIcon,
      alt: "Support the Environment Icon",
      title: "Support the Environment",
      description: "Every action you take contributes to a healthier and greener planet.",
    },
    {
      icon: SaveMoneyIcon,
      alt: "Save Money Icon",
      title: "Save Money",
      description: "By reducing waste, you can also lower disposal costs and save on purchasing new materials.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className='non-registered-home'>
      <header className='nonreg-header'>
        <img src={Logo} alt='Zero Waste Logo' className='logo' />
        <nav className='nonreg-navbar'>
          <a href='/resident-nonreghome' className='nonreg-nav-link'>
            Home
          </a>
          <a href='/history' className='nonreg-nav-link'>
            About
          </a>
          <a href='#contact' className='nonreg-nav-link'>
            Contact Us
          </a>
          <a href='/resident-signup' className='nonreg-nav-link'>
            Sign Up
          </a>
          <a href='/admin-login' className='nonreg-nav-link'>
            Admin Login
          </a>
          <a href='/collector-signup' className='nonreg-nav-link'>
            Collector Login
          </a>
        </nav>
      </header>

      <section className='slider-section'>
        <button className='slider-button prev' onClick={prevSlide} aria-label='Previous Slide'>
          {"<"}
        </button>
        <div className='slider'>
          <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className='slider-image' />
          <div className='slider-content'>
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].description}</p>
          </div>
        </div>
        <button className='slider-button next' onClick={nextSlide} aria-label='Next Slide'>
          {">"}
        </button>
      </section>

      <section className='benefits-section'>
        <h2>Why Choose Zero Waste?</h2>
        <div className='benefits-grid'>
          {benefits.map((benefit, index) => (
            <div key={index} className='benefit-card'>
              <div className='icon-container'>
                <img src={benefit.icon} alt={benefit.alt} className='benefit-icon' />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className='nonreg-footer'>
        <p>© 2024 Zero Waste Initiative | All Rights Reserved</p>
        <p>Contact: info@zerowaste.com | Phone: +1 (123) 456-7890</p>
      </footer>
    </div>
  );
};

export default NonRegisteredHome;
