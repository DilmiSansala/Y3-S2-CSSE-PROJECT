import React from "react";
import SidebarIcon from "../components/sidebar/SidebarIcon";
import Header from "../components/header/Header";
import "../components/sidebar/styles.css";
import "./home.css";
import CardView from "../components/CardView";
import Footer from "../components/Footer";
import withAuth from "../hoc/withAuth";

// Import images and icons
import RecyclingIcon from "../images/recycle-right.png";
import EcoFriendlyIcon from "../images/footprint.jpg";
import CollectionIcon from "../images/landfill.jpg";
import ServicesImage from "../images/slider2.jpeg";
import User1 from "../images/user1.jpg";
import User2 from "../images/user2.jpg";

// Define constants for text and image sources to enhance readability and maintainability
const SERVICES = [
  {
    img: RecyclingIcon,
    alt: "Recycling Solutions",
    title: "Recycling Solutions",
    description: "We provide efficient recycling services to reduce waste and repurpose materials.",
  },
  {
    img: EcoFriendlyIcon,
    alt: "Eco-Friendly Practices",
    title: "Eco-Friendly Practices",
    description: "All our processes are designed to be environmentally friendly and sustainable.",
  },
  {
    img: CollectionIcon,
    alt: "On-Demand Collection",
    title: "On-Demand Collection",
    description: "Request waste collection services at your convenience through our easy-to-use platform.",
  },
];

const TESTIMONIALS = [
  {
    img: User1,
    alt: "User",
    name: "Sarah J., Business Owner",
    quote: "Eco Waste Management has completely transformed our approach to waste disposal. Highly recommend!",
  },
  {
    img: User2,
    alt: "User",
    name: "John D., Eco Enthusiast",
    quote: "Their commitment to sustainability and the environment is truly impressive.",
  },
  {
    img: User1,
    alt: "User",
    name: "Sarah J., Business Owner",
    quote: "Eco Waste Management has completely transformed our approach to waste disposal. Highly recommend!",
  },
  {
    img: User2,
    alt: "User",
    name: "John D., Eco Enthusiast",
    quote: "Their commitment to sustainability and the environment is truly impressive.",
  },
  {
    img: User1,
    alt: "User",
    name: "Sarah J., Business Owner",
    quote: "Eco Waste Management has completely transformed our approach to waste disposal. Highly recommend!",
  },
  {
    img: User2,
    alt: "User",
    name: "John D., Eco Enthusiast",
    quote: "Their commitment to sustainability and the environment is truly impressive.",
  },
];

// Define the Home component
function Home() {
  return (
    <div className='home-container'>
      <SidebarIcon />
      <div className='main-content'>
        <Header />
        <div className='cards-section'>
          <CardView />
        </div>

        {/* Services Section */}
        <div className='services-section'>
          <h2>Our Services</h2>
          <div className='services-grid'>
            {SERVICES.map((service, index) => (
              <div key={index} className='service-card'>
                <img src={service.img} alt={service.alt} className='service-icon' />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
          <div className='services-image-container'>
            <img src={ServicesImage} alt='Services Overview' className='services-image' />
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className='cta-section'>
          <h2>Ready to Make a Difference?</h2>
          <p>Join us today and contribute to a cleaner and greener environment. Get started now!</p>
          <button className='cta-button'>Get Started</button>
        </div>

        {/* Testimonials Section */}
        <div className='testimonials-section'>
          <h2>What Our Clients Say</h2>
          <div className='testimonials-container'>
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className='testimonial-card'>
                <div className='testimonial-content'>"{testimonial.quote}"</div>
                <div className='testimonial-author'>
                  <img src={testimonial.img} alt={testimonial.alt} />
                  <p>{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// Wrap Home with withAuth when exporting
export default withAuth(Home);
