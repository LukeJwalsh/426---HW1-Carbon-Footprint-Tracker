import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <header className="bg-[#145a32] text-white p-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 shadow-[0_6px_12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center flex-wrap">
        <h1 className="text-3xl font-bold mr-4">{title} 🌱</h1>
        <nav className="flex flex-wrap">
          <Link to="/" className="mr-4 text-white hover:underline glow-on-hover">
            📓Activity Log
          </Link>
          <Link to="/summary" className="text-white hover:underline glow-on-hover">
            📊Summary
          </Link>
        </nav>
      </div>
      <button
        onClick={handleReset}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Reset
      </button>
    </header>
  );
};

export default Header;
