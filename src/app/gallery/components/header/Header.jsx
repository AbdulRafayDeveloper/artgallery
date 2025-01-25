"use client";
import React from "react";
import Link from "next/link";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-50 w-full flex items-center justify-between px-4 py-[18px] lg:fixed z-10">
      <div className="flex-shrink-0">
        <p className="font-semibold text-gray-700" style={{fontSize:"16px"}}>Welcome to Art Gallery</p>
      </div>
      <div className="hidden lg:flex flex-grow justify-end">
        <Link
          href="/home"
          className="bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg px-4 py-2 text-white" style={{fontSize:"14px"}}
        >
          Move to Images
        </Link>
      </div>

      {/* Menu Button on the right for small screens */}
      <div className="flex-grow flex justify-end lg:hidden">
        <button
          onClick={toggleSidebar}
          className="focus:ring-4 focus:outline-none font-lg rounded-lg text-sm px-4 py-2 text-black"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
