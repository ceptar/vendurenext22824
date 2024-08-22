import React from "react";
import Link from "next/link";
import NavMenuToggle from "./NavMenuToggle";

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (_: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ menuOpen, setMenuOpen }) => {
  return (
    <div className="flex items-center p-2 mr-4 sticky top-0 mix-blend-difference z-[100]">
      <NavMenuToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
};

export default Navbar;
