import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      <footer className="bg-gray-700">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <form className="max-w-sm mx-auto">
                <h2 className="text-2xl font-semibold pb-4 text-white pl-2">
                  Subscribe
                </h2>
                <label
                  for="email-address-icon"
                  className="block mb-2 text-sm font-medium text-white pl-2"
                >
                  Stay updated on how future of technology is shaping.
                </label>
                <div className="flex items-center">
                  <div className="relative flex-grow ml-2">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 16"
                      >
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="email-address-icon"
                      className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full ps-10 p-2.5 border-gray-600 placeholder-gray-400 focus:border-blue-500"
                      placeholder="Enter your email here"
                    />
                  </div>
                  <button
                    type="button"
                    className="bg-gray-800 text-white p-2 rounded-md font-light ml-2 hover:bg-none hover:bg-gray-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                  Services
                </h2>
                <ul className="text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link
                      href="/services/web"
                      className="hover:text-indigo-500"
                    >
                      Web Technologies
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      href="/services/mob"
                      className="hover:text-indigo-500"
                    >
                      Mobile Technologies
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/services/ai" className="hover:text-indigo-500">
                      AI Technologies
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      href="/services/cloud"
                      className="hover:text-indigo-500"
                    >
                      Cloud Technologies
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      href="/services/seo"
                      className="hover:text-indigo-500"
                    >
                      SEO
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                  Insight
                </h2>
                <ul className="text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link
                      href="/../portfolio/"
                      className="hover:text-indigo-500"
                    >
                      Portfolio
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/../blogs/" className="hover:text-indigo-500">
                      Blogs
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/../faq/" className="hover:text-indigo-500">
                      FAQs
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/../terms/" className="hover:text-indigo-500">
                      Terms of Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold  uppercase text-white">
                  Quick Links
                </h2>
                <ul className="text-gray-400 font-medium">
                  <li className="mb-4">
                    <Link href="/../career/" className="hover:text-indigo-500">
                      Career
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/../contact/" className="hover:text-indigo-500">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between pr-14">
            <span className="text-sm  sm:text-center text-gray-400 pl-2 ">
              © 2024{" "}
              <a href="https://flowbite.com/" className="hover:underline">
                DevWays™
              </a>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <Link
                href="#"
                className="text-white bg-gray-500 hover:text-gray-500 hover:bg-white rounded-full border-transparent p-1"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 8 19"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook page</span>
              </Link>
              <Link
                href="#"
                className="text-white bg-gray-500 hover:text-gray-500 hover:bg-white rounded-full border-transparent p-1 ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.25 0H.75C.336 0 0 .336 0 .75v18.5c0 .414.336.75.75.75h18.5c.414 0 .75-.336.75-.75V.75c0-.414-.336-.75-.75-.75zM6.072 16.919H3.266V7.904h2.806v9.015zM4.669 6.741c-.875 0-1.582-.707-1.582-1.582 0-.874.707-1.581 1.582-1.581.875 0 1.581.707 1.581 1.581 0 .875-.707 1.582-1.581 1.582zM16.744 16.919h-2.803V12.62c0-1.021-.018-2.335-1.422-2.335-1.423 0-1.641 1.111-1.641 2.257v4.377h-2.804V7.904h2.695v1.237h.039c.375-.71 1.293-1.456 2.66-1.456 2.844 0 3.372 1.87 3.372 4.299v5.935z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="text-white bg-gray-500 hover:text-gray-500 hover:bg-white rounded-full border-transparent p-1 ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub account</span>
              </Link>
              <Link
                href="#"
                className="text-white bg-gray-500 hover:text-gray-500 hover:bg-white rounded-full border-transparent p-1 ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.001 2.667c2.413 0 2.698.01 3.65.052.95.043 1.583.197 2.192.415.618.222 1.148.518 1.676 1.046.527.527.824 1.057 1.046 1.676.218.609.372 1.242.415 2.192.042.952.051 1.237.051 3.65 0 2.413-.01 2.698-.051 3.65-.043.95-.197 1.583-.415 2.192-.222.618-.518 1.148-1.046 1.676-.527.527-1.057.824-1.676 1.046-.609.218-1.242.372-2.192.415-.952.042-1.237.051-3.65.051-2.413 0-2.698-.01-3.65-.051-.95-.043-1.583-.197-2.192-.415-.618-.222-1.148-.518-1.676-1.046-.527-.527-.824-1.057-1.046-1.676-.218-.609-.372-1.242-.415-2.192-.042-.952-.051-1.237-.051-3.65 0-2.413.01-2.698.051-3.65.043-.95.197-1.583.415-2.192.222-.618.518-1.148 1.046-1.676.527-.527 1.057-.824 1.676-1.046.609-.218 1.242-.372 2.192-.415.952-.042 1.237-.051 3.65-.051zm0-2.667c-2.444 0-2.751.011-3.71.054-.957.043-1.627.197-2.28.425-.73.244-1.344.598-1.961 1.215-.617.617-.97 1.231-1.215 1.961-.228.653-.382 1.323-.425 2.28-.043.959-.054 1.266-.054 3.71s.011 2.751.054 3.71c.043.957.197 1.627.425 2.28.244.73.598 1.344 1.215 1.961.617.617 1.231.97 1.961 1.215.653.228 1.323.382 2.28.425.959.043 1.266.054 3.71.054s2.751-.011 3.71-.054c.957-.043 1.627-.197 2.28-.425.73-.244 1.344-.598 1.961-1.215.617-.617.97-1.231 1.215-1.961.228-.653.382-1.323.425-2.28.043-.959.054-1.266.054-3.71s-.011-2.751-.054-3.71c-.043-.957-.197-1.627-.425-2.28-.244-.73-.598-1.344-1.215-1.961-.617-.617-1.231-.97-1.961-1.215-.653-.228-1.323-.382-2.28-.425-.959-.043-1.266-.054-3.71-.054zm0 5.486a4.514 4.514 0 100 9.028 4.514 4.514 0 000-9.028zm0 7.457a2.943 2.943 0 110-5.886 2.943 2.943 0 010 5.886zm6.634-7.942a1.048 1.048 0 11-2.096 0 1.048 1.048 0 012.096 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Instagram account</span>
              </Link>
            </div>
          </div>
          <button
            onClick={handleScrollToTop}
            className="mt-4 bg-gray-600 opacity-80 shadow-lg text-white font-light rounded-full w-10 h-10 flex items-center justify-center ml-auto mr-8"
          >
            <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
