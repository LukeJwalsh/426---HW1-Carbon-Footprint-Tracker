import React from "react";

// Props for customizing the footer message and optional styling
interface FooterProps {
  message: string;
  className?: string;
}

// Simple footer component
const Footer: React.FC<FooterProps> = ({ message, className = "" }) => {
  return (
    // Styled footer with optional custom className
    <footer className={`bg-[#145a32] text-white p-3 text-center text-sm ${className}`}>
      {message}
    </footer>
  );
};

export default Footer;
