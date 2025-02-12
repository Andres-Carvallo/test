/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { sidebarLinks } from "./sidebarLinks";
import Image from "next/image";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLinkClick = (href: string) => {
    if (href === pathname) {
      window.location.reload();
    }
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const renderLink = (link: (typeof sidebarLinks)[0]) => {
    if (link.submenu) {
      return (
        <SidebarLinkGroup
          activeCondition={pathname.includes(link.path)}
          isExpanded={isExpanded || isHovered}
        >
          {(handleClick, open) => (
            <React.Fragment>
              <Link
                href="#"
                className={`group relative flex items-center gap-3 rounded-lg py-2.5 px-4 font-medium text-secondary duration-300 ease-in-out hover:bg-black/10 ${
                  open && "bg-black/10"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                }}
              >
                <div className="min-w-max">{link.icon}</div>
                <span
                  className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                    !isExpanded && !isHovered
                      ? "opacity-0 -translate-x-10"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  {link.title}
                </span>
                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-all duration-300 ease-in-out ${
                    open ? "rotate-180" : ""
                  } ${
                    !isExpanded && !isHovered
                      ? "opacity-0 -translate-x-10"
                      : "opacity-100 translate-x-0"
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                    fill=""
                  />
                </svg>
              </Link>
              <div
                className={`translate transform overflow-hidden transition-all duration-300 ease-in-out ${
                  !open ? "h-0" : "h-auto"
                }`}
              >
                <ul className="mt-2 mb-3 flex flex-col gap-2 pl-10">
                  {link.submenu?.map((sublink, index) => (
                    <li key={index}>
                      <Link
                        href={sublink.path}
                        className={`group relative flex items-center gap-3 rounded-lg py-2 px-4 font-medium text-secondary duration-300 ease-in-out hover:bg-black/10 ${
                          pathname === sublink.path && "bg-black/10"
                        }`}
                        onClick={() => handleLinkClick(sublink.path)}
                      >
                        <div className="min-w-max">{sublink.icon}</div>
                        <span
                          className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                            !isExpanded && !isHovered
                              ? "opacity-0 -translate-x-10"
                              : "opacity-100 translate-x-0"
                          }`}
                        >
                          {sublink.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          )}
        </SidebarLinkGroup>
      );
    }

    return (
      <li>
        <Link
          href={link.path}
          className={`group relative flex items-center gap-3 rounded-lg py-2.5 px-4 font-medium text-secondary duration-300 ease-in-out hover:bg-black/10 ${
            pathname === link.path && "bg-black/10"
          }`}
          onClick={() => handleLinkClick(link.path)}
        >
          <div className="min-w-max">{link.icon}</div>
          <span
            className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
              !isExpanded && !isHovered
                ? "opacity-0 -translate-x-10"
                : "opacity-100 translate-x-0"
            }`}
          >
            {link.title}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      ref={sidebar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute left-0 top-0 z-40 flex h-screen ${
        isExpanded || isHovered ? "w-[200px]" : "w-[80px]"
      } flex-col overflow-y-hidden bg-primary shadow-lg transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="relative flex flex-col items-center border-b border-white/10">
        <div className="flex w-full items-center justify-between px-2 py-4">
          <Link
            href="/"
            className="flex items-center"
          >
            <div className="relative h-16 w-[150px]">
              <div
                className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
                  !isExpanded && !isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src="/logo-w.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div
                className={`absolute left-0 -top-[5px] transition-all duration-300 ease-in-out ${
                  isExpanded || isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src="/logo-w.png"
                  alt="Logo"
                  width={150}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
          </Link>

          <button
            ref={trigger}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-controls="sidebar"
            aria-expanded={isExpanded}
            className={`block transition-all duration-300 ease-in-out lg:hidden ${
              !isExpanded && !isHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-10 py-4 px-2">
          <div>
            <ul className="mb-6 flex flex-col gap-2">
              {sidebarLinks.map((link, index) => (
                <React.Fragment key={index}>{renderLink(link)}</React.Fragment>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
