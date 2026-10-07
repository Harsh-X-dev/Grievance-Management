import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const TESTIMONIALS = [
  {
    rating: "★★★★★",
    quote:
      "I had an issue with my examination fees. I raised a ticket, and the Accounts department cleared it within 4 hours. No running around counters.",
    name: "Priya Sharma",
    dept: "CS Department",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
  },
  {
    rating: "★★★★★",
    quote:
      "As a hostel warden, this system is a lifesaver. I get notified immediately when students face maintenance issues.",
    name: "Dr. Rajesh Verma",
    dept: "Chief Warden",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    rating: "★★★★☆",
    quote:
      "The anonymity feature is great. I was hesitant to report a sensitive incident, but the system allowed me to do it safely.",
    name: "Anonymous",
    dept: "Mechanical Dept.",
    initial: "A",
  },
];

export const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Carousel timer
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Scroll spy & reveal animation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "dashboard-section", "track-section", "stories-section", "login-section"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getPortalLink = () => {
    if (!isAuthenticated || !user) return "/auth";
    if (user.role === "student") return "/student";
    if (user.role === "admin") return "/admin";
    if (user.role === "superadmin") return "/superadmin";
    return "/auth";
  };

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] overflow-x-hidden min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-[#f5f5f7]/80 border-b border-gray-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#hero" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition">
              G
            </div>
            <span className="font-semibold text-brandBlack tracking-tight text-lg">
              / Grievance.io
            </span>
          </a>

          <div className="hidden md:flex bg-gray-200/50 p-1 rounded-full gap-1">
            <a
              href="#dashboard-section"
              className={`nav-link px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === "dashboard-section"
                  ? "bg-white text-black shadow-sm font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Dashboard
            </a>
            <a
              href="#track-section"
              className={`nav-link px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === "track-section"
                  ? "bg-white text-black shadow-sm font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Track Status
            </a>
            <a
              href="#stories-section"
              className={`nav-link px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === "stories-section"
                  ? "bg-white text-black shadow-sm font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Stories
            </a>
            <a
              href="#login-section"
              className={`nav-link px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === "login-section"
                  ? "bg-white text-black shadow-sm font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Join Now
            </a>
          </div>

          <Link
            to={getPortalLink()}
            className="text-sm font-medium border border-gray-300 px-5 py-2 rounded-full hover:bg-black hover:text-white transition shadow-sm"
          >
            {isAuthenticated ? "Go to Dashboard" : "Login"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-serif leading-[1]">
              Resolve<sup className="text-4xl text-gray-400 font-sans">+</sup>
            </h1>
            <p className="text-xl text-gray-500 max-w-md leading-relaxed">
              The modern way to handle student grievances. Fast, transparent, and completely digital.
            </p>
            <div className="flex gap-4">
              <a
                href="#dashboard-section"
                className="bg-black text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition shadow-xl inline-block"
              >
                Explore Features
              </a>
              <Link
                to={getPortalLink()}
                className="bg-white text-black border border-gray-300 px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition shadow-sm inline-block"
              >
                {isAuthenticated ? "My Portal" : "Sign In"}
              </Link>
            </div>
          </div>
          <div className="relative h-[500px] w-full bg-gray-200 rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
              alt="Students collaborating"
              className="object-cover w-full h-full opacity-90 hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Feature Section */}
      <section
        id="dashboard-section"
        className="min-h-screen flex items-center py-20 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2 block">
              The Interface
            </span>
            <h2 className="text-5xl font-serif mb-6 text-gray-900">
              Simple, yet powerful.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We stripped away the clutter. The <strong>Student Dashboard</strong> gives you a bird's-eye view of your academic concerns. File a complaint in 3 clicks.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="font-medium text-gray-700">One-click submission</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="font-medium text-gray-700">Real-time messaging thread</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="font-medium text-gray-700">Full audit trail & SLA tracking</span>
              </li>
            </ul>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="glass-card rounded-2xl p-6 w-full aspect-[4/3] relative overflow-hidden transform rotate-2 hover:rotate-0 transition duration-500 shadow-xl border border-white">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-4">
                <div className="w-8 h-8 rounded-lg bg-black"></div>
                <div className="w-6 h-6 rounded bg-gray-200 mt-4"></div>
                <div className="w-6 h-6 rounded bg-gray-200"></div>
              </div>
              <div className="ml-16 mb-6 flex justify-between items-center">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              </div>
              <div className="ml-16 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl h-32 flex flex-col justify-between">
                  <span className="text-xs font-bold text-blue-600">Active</span>
                  <span className="text-2xl font-bold text-gray-800">3 Cases</span>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl h-32 flex flex-col justify-between">
                  <span className="text-xs font-bold text-orange-600">Resolved</span>
                  <span className="text-2xl font-bold text-gray-800">12 Cases</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Tracking Section */}
      <section id="track-section" className="min-h-screen flex items-center py-20 bg-[#f5f5f7] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="glass-card rounded-3xl p-8 max-w-md mx-auto relative -rotate-2 hover:rotate-0 transition duration-500 shadow-xl border border-white">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Ticket ID #4920
                  </p>
                  <h3 className="text-xl font-bold mt-1 text-gray-900">Hostel WiFi Issue</h3>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  In Progress
                </span>
              </div>
              <div className="relative border-l-2 border-gray-200 ml-2 space-y-8 pl-6">
                <div className="relative">
                  <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                  <p className="text-sm font-bold text-gray-900">Submitted</p>
                  <p className="text-xs text-gray-500">Oct 25, 10:00 AM</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-yellow-400 ring-4 ring-white animate-pulse"></div>
                  <p className="text-sm font-bold text-gray-900">Technician Assigned</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-2 block">
              Real-time Updates
            </span>
            <h2 className="text-5xl font-serif mb-6 text-gray-900">
              Never wonder "What happened?"
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With our <strong>Live Tracker</strong>, watch your grievance move from submission to resolution in real-time. Every message and status shift is recorded clearly.
            </p>
          </div>
        </div>
      </section>

      {/* Stories / Testimonials Carousel */}
      <section id="stories-section" className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-5xl font-serif mb-4 text-gray-900">Voices from Campus</h2>
          <p className="text-gray-500">See how fast redressal is changing campus life.</p>
        </div>

        <div
          className="max-w-4xl mx-auto px-6 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden rounded-3xl p-2">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-4">
                  <div className="glass-card p-10 rounded-3xl border border-gray-100 bg-gray-50/50 flex flex-col items-center text-center shadow-lg">
                    <div className="flex gap-1 text-yellow-500 mb-6 text-xl">{t.rating}</div>
                    <p className="text-2xl font-serif text-gray-800 italic mb-8 leading-relaxed max-w-2xl">
                      "{t.quote}"
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-white shadow-md">
                          {t.initial}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-base text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{t.dept}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel dots / progress */}
          <div className="flex justify-center gap-2 mt-8 items-center">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === i ? "w-8 h-2 bg-black" : "w-2 h-2 bg-gray-300"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="login-section"
        className="min-h-screen flex flex-col justify-center items-center py-20 bg-[#f5f5f7] text-center px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-50 pointer-events-none"></div>
        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-serif mx-auto shadow-xl mb-4">
            G+
          </div>
          <h2 className="text-5xl sm:text-7xl font-serif text-brandBlack">
            Ready to be heard?
          </h2>
          <div className="pt-8">
            <Link
              to={getPortalLink()}
              className="inline-block bg-black text-white text-lg font-medium px-12 py-5 rounded-full shadow-2xl hover:scale-105 hover:bg-gray-900 transition duration-300"
            >
              {isAuthenticated ? "Enter Your Dashboard" : "Login Now to Get Redressal"}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 text-xs text-gray-400">
          © 2026 Grievance.io System.
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
