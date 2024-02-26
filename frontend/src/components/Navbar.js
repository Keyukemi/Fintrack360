import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/fintrack360-logo.png";
//import LinkAccount from "./Account";

const Navbar = () => {
  // const [showModal, setShowModal] = useState(false);

  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  return (
    <header className="bg-headline py-2 px-6 mx-auto">
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
          <ul className="flex space-x-4">
            <li  className="transition duration-300 bg-tertiary text-headline mb-4 font-bold  border-2 rounded-md  p-2
               hover:bg-primary">
              Add BVN
            </li>
            {/* <li>
              <button
                onClick={toggleModal}
                className="transition duration-300 bg-tertiary text-headline mb-4 font-bold  border-2 rounded-md  p-2
               hover:bg-primary"
              >
                Link account
              </button>
              {showModal && (
                 <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
                 <div className="bg-white p-8 rounded-md shadow-md">
                     <button onClick={toggleModal} className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800">&times;</button>
                     <LinkAccount onCloseModal={handleCloseModal} />
                 </div>
             </div>
              )}
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
