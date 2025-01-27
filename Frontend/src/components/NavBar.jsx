import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/"); // Redirect to login page after logout
  };

  const navi = () => {
    navigate("/dashboard");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <Link to="/dashboard">Mark me!</Link>
        </div>

        {/* Navbar links */}
        <div className="hidden md:flex space-x-8">
          <button
            onClick={navi}
            className="text-white text-lg hover:text-indigo-200 cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-white text-lg hover:text-indigo-200"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button className="text-white text-2xl" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-500 transform ${
          menuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="bg-indigo-600 p-4 space-y-4">
          <Link
            to="/profile"
            className="text-white text-lg block hover:text-indigo-200"
          >
            Profile
          </Link>
          <Link
            to="/menu"
            className="text-white text-lg block hover:text-indigo-200"
          >
            Menu
          </Link>
          <button
            onClick={handleLogout}
            className="text-white text-lg block hover:text-indigo-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
