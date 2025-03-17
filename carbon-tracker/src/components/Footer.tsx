import React from "react";

interface FooterProps {
  message: string;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ message, className = "" }) => {
  return (
    <footer className={`bg-[#145a32] text-white p-3 text-center text-sm ${className}`}>
      {message}
    </footer>
  );
};

export default Footer;
