import { ComputerIcon, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center text-gray-600 text-sm">
        <div>
          © 2025 IT Asset Management System.
        </div>
        <div className="flex items-center gap-1">
          Version 1.0.1 | Developed with 
          <ComputerIcon className="w-4 h-4 text-red-500 fill-red-500" />
          by ITNMD Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
