"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      id="default-sidebar"
      className={`fixed left-0 w-64 h-screen transition-transform  ${isSidebarOpen ? "translate-x-0 z-10" : "-translate-x-full z-10"
        } bg-gray-50 shadow-lg pt-4 lg:mt-32 rounded-tr-md lg:translate-x-0 lg:relative lg:w-64 `}
      aria-label="Sidebar"
    >
      <div className="px-3 py-4 z-20 h-full" style={{fontSize:"14px"}}>
        <ul className="space-y-2 font-medium pl-4">
          <li>
            <Link
              href="/gallery/dashboard"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group font-light"
            >
              <FontAwesomeIcon
                icon={faTachometerAlt}
                className="flex-shrink-0 w-5 h-5 text-gray-700 transition duration-75 group-hover:text-gray-900"
              />
              <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/gallery/image/list"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group font-light"
            >
              <FontAwesomeIcon
                icon={faUserGroup}
                className="flex-shrink-0 w-5 h-5 text-gray-700 transition duration-75 group-hover:text-gray-900"
              />
              <span className="flex-1 ms-3 whitespace-nowrap">Images</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
