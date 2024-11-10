"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import AOS from "aos";
import "aos/dist/aos.css";
import { Inter, Poppins, Roboto_Slab, Dancing_Script } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: ["300", "400", "600"], subsets: ["latin"] });
const robotoSlab = Roboto_Slab({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ subsets: ["latin"] });

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function Component() {
  useEffect(() => {
    AOS.init();

    // GSAP Animations
    gsap.from(".logo", {
      opacity: 0,
      y: -10,
      delay: 1,
      duration: 0.5,
    });

    gsap.from(".nav-links a", {
      opacity: 0,
      y: -10,
      delay: 1.4,
      duration: 0.5,
    });

    gsap.from(".hero-content", {
      opacity: 0,
      y: 20,
      delay: 2.4,
      duration: 1,
    });

    gsap.from(".hero-image", {
      opacity: 0,
      scale: 0.8,
      delay: 3,
      duration: 1,
    });

    gsap.from(".floating-leaves", {
      y: -20,
      opacity: 0,
      duration: 1,
      delay: 3.5,
      stagger: 0.2,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#a4d88d] overflow-hidden">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-sm">
          <div className="container h-16 px-4 mx-auto">
            <nav className="flex items-center justify-between h-full">
              <a
                href="#"
                className={`${robotoSlab.className} logo text-3xl font-semibold text-green-600`}
              >
                Greenit.
              </a>
              <div className="items-center hidden space-x-6 nav-links md:flex">
                {["login", "signup"].map((button, index) => (
                  <a
                    key={index}
                    href={`/${button}`}
                    className={`${poppins.className} text-gray-800 hover:text-green-700 transition-colors`}
                  >
                    {button}
                  </a>
                ))}
              </div>

              <button className="text-gray-600 md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </header>

        <main className="pt-24 pb-16">
          <div className="container px-4 mx-auto">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="z-10 space-y-6 hero-content">
                <h1
                  className={`${dancingScript.className} text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-gray-800`}
                >
                  Welcome to <span className="text-green-600">Greenit.</span>
                  <br />
                  Here&apos;s your chance to making Earth a better place.
                </h1>
                <p className={`${poppins.className} text-xl text-green-700`}>
                  Less Carbon. More Life
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    className={`${inter.className} px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors`}
                  >
                    Leads Somewhere
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    className={`${inter.className} px-6 py-3 bg-gray-100 text-green-600 rounded-lg hover:bg-gray-200 transition-colors`}
                  >
                    Leads Somewhere
                  </button>
                </div>
              </div>
              <div className="relative hero-image-container">
                <div className="overflow-hidden transition-transform duration-300 transform shadow-2xl hero-image rounded-3xl rotate-3 hover:rotate-0">
                  <img
                    src="/Screenshot 2024-11-09 204357.png"
                    alt="Team illustration"
                    className="w-full h-auto"
                  />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`floating-leaves absolute w-8 h-8 bg-green-400 rounded-full opacity-50 animate-float-${
                      i + 1
                    }`}
                    style={{
                      top: `${seededRandom(i * 1) * 100}%`,
                      left: `${seededRandom(i * 2) * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="container px-4 mx-auto mt-24">
            <div
              className="grid gap-8 md:grid-cols-3"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`${poppins.className} text-xl font-semibold mb-2`}
                  >
                    CONTENT
                  </h3>
                  <p className={`${inter.className} text-gray-700`}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore ratione facilis animi voluptas exercitationem
                    molestiae.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="h-3 bg-green-600" />
      </div>
    </div>
  );
}
