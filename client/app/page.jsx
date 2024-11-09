"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import AOS from "aos";
import "aos/dist/aos.css"; // Include AOS CSS
import "./lp.css"

const LandingPage = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init();

    // GSAP Animations
    gsap.from(".logo", {
      opacity: 0,
      y: -10,
      delay: 1,
      duration: 0.5,
    });
    gsap.from(".nav_menu_list .nav_menu_item", {
      opacity: 0,
      y: -10,
      delay: 1.4,
      duration: 0.5,
      stagger: 0.3,
    });
    gsap.from(".toggle_btn", {
      opacity: 0,
      y: -10,
      delay: 1.4,
      duration: 0.5,
    });
    gsap.from(".main-heading", {
      opacity: 0,
      y: 20,
      delay: 2.4,
      duration: 1,
    });
    gsap.from(".info-text", {
      opacity: 0,
      y: 20,
      delay: 2.8,
      duration: 1,
    });
    gsap.from(".btn_wrapper", {
      opacity: 0,
      y: 20,
      delay: 2.8,
      duration: 1,
    });
    gsap.from(".team_img_wrapper img", {
      opacity: 0,
      y: 20,
      delay: 3,
      duration: 1,
    });
  }, []);

  const handleToggleMenu = () => {
    document.getElementById("nav_menu").classList.add("show");
  };

  const handleCloseMenu = () => {
    document.getElementById("nav_menu").classList.remove("show");
  };

  return (
    <div className="landing">
      {/* Header */}
      <header className="container header">
        <nav className="nav">
          <div className="logo">
            <h2>Greenit.</h2>
          </div>

          <div className="nav_menu" id="nav_menu">
            <button className="close_btn" id="close_btn" onClick={handleCloseMenu}>
              <i className="ri-close-fill"></i>
            </button>

            <ul className="nav_menu_list">
              <li className="nav_menu_item">
                <a href="#" className="nav_menu_link">button1</a>
              </li>
              <li className="nav_menu_item">
                <a href="#" className="nav_menu_link">button2</a>
              </li>
              <li className="nav_menu_item">
                <a href="#" className="nav_menu_link">button3</a>
              </li>
              <li className="nav_menu_item">
                <a href="#" className="nav_menu_link">button4</a>
              </li>
            </ul>
          </div>

          <button className="toggle_btn" id="toggle_btn" onClick={handleToggleMenu}>
            <i className="ri-menu-line"></i>
          </button>
        </nav>
      </header>

      {/* Main Section */}
      <section className="wrapper">
        <div className="container">
          <div className="grid-cols-2">
            <div className="grid-item-1">
              <h1 className="main-heading">
                Welcome to <span>Greenit.</span>
                <br />
                Here's your chance to make Earth a better place.
              </h1>
              <p className="info-text">Less Carbon. More Life</p>

              <div className="btn_wrapper">
                <button className="btn view_more_btn">
                  Leads somewhere <i className="ri-arrow-right-line"></i>
                </button>

                <button className="btn documentation_btn">Leads somewhere</button>
              </div>
            </div>
            <div className="grid-item-2">
              <div className="team_img_wrapper">
                <img src="/img/team.svg" alt="team-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="wrapper">
        <div className="container" data-aos="fade-up" data-aos-duration="1000">
          <div className="grid-cols-3">
            <div className="grid-col-item">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="featured_info">
                <span className="title">CONTENT</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ratione facilis animi voluptas exercitationem molestiae.</p>
              </div>
            </div>
            <div className="grid-col-item">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="featured_info">
                <span className="title">CONTENT</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ipsum esse corrupti. Quo, labore debitis!</p>
              </div>
            </div>

            <div className="grid-col-item">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="featured_info">
                <span className="title">CONTENT</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non nostrum voluptate totam ipsa corrupti vero!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer></footer>
    </div>
  );
};

export default LandingPage;
