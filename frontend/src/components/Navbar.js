import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/fintrack360-logo.png";


const Navbar = () => {
  return (
    <header className="bg-headline py-2 px-6 mx-auto rounded-md  w-full top-0 z-10">
      <div className="container flex justify-between items-center">
        <Link to="/">
          <div className="p-4 flex justify-between items-end">
            <img src={Logo} alt="" className="h-12" />
            <p className="text-2xl">
              FinTrack<strong className="text-primary">360</strong>
            </p>
          </div>
        </Link>
        <nav className="hidden md:block text-paragraph">
          <ul className="">
            <Link to="/">
              <li className="bg-tertiary text-headline mb-4 font-bold  border-2 rounded-md  p-2 hover:bg-primary">
                Add New BVN
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
