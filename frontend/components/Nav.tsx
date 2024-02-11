import { ConnectButton, darkTheme } from "@rainbow-me/rainbowkit";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 180) {
        setAnimateHeader(true);
      } else {
        setAnimateHeader(false);
      }
    };
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [animateHeader]);

  //OG Nav bar
  //<nav className="flex bg-transparent  py-3 px-1 justify-between w-full items-center  fixed top-0 z-50 "> {/* absolute or fixed*/}

  //was used before
  // <nav
  //     className={`flex bg-black pt-10 pb-10 px-1 w-full justify-between items-center fixed top-0 z-50 duration-500 ease-in-out ${
  //       animateHeader &&
  //       " backdrop-filter backdrop-blur-lg bg-black/25 trasition shadow-xl "
  //     }`}
  //   ></nav>

  return (
    <nav className="flex bg-transparent px-1 justify-between w-full items-center"> {/* absolute or fixed*/}
      <div className="container px-1 mx-auto flex flex-wrap items-center justify-between ">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          {/* Logo - Title */}

          <div className="relative inline-block">
            <iframe
              src="https://lottie.host/embed/973d8985-c200-4029-a5fb-a17c4ceeb3bf/yBF3l74Ugu.json"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                border: 'none',
                pointerEvents: 'none', // This ensures that the iframe doesn't intercept mouse events
              }}
            ></iframe>
            <Link legacyBehavior href="/">
              <a
                className="text-3xl font-bold text-white relative z-0 whitespace-nowrap uppercase drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]"
              >
                Snowday
              </a>
            </Link>
          </div>
          {/*  Hamburger Menu  */}
          <button
            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <FontAwesomeIcon
              icon={faBars}
              width="24px"
              className="text-blue-500 "
            />
          </button>
        </div>

        <div
          className={
            "lg:flex flex-grow items-center  lg:bg-transparent lg:shadow-none " +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="nav-drop"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="flex items-center">
              <a
                className="py-2 text-sm uppercase cursor-pointer px-6 font-bold leading-snug text-white lg:text-base lg:text-white hover:opacity-75 lg:px-3"
                onClick={() => router.push("/")}
              >
                <i className="leading-lg opacity-75"></i>
                <span>Home</span>
              </a>
            </li>
            <li className="flex items-center">
              <a
                className="py-2 text-sm uppercase cursor-pointer px-6 font-bold leading-snug text-white lg:text-base lg:text-white hover:opacity-75 lg:px-3"
                onClick={() => router.push("/claim")}
              >
                <i className="leading-lg opacity-75"></i>
                <span>Claim</span>
              </a>
            </li>
            <li className="flex items-center">
              <a
                className="py-2 text-sm uppercase px-6 font-bold leading-snug text-gray-800 lg:text-base lg:text-white hover:opacity-75 lg:px-3 drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]"
                href="https://goerli.basescan.org/address/0xba18f2dc2ce0b971f33236fdf76e227bf9d8ddbd"
                target="_blank"
                rel="noreferrer"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className=" leading-lg  opacity-75"></i>
                <span className="text-white">Contract</span>
              </a>
            </li>

            <li className="py-2 flex items-center px-3 lg:mb-0 lg:px-0 lg:ml-2">
              <ConnectButton showBalance={false} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
