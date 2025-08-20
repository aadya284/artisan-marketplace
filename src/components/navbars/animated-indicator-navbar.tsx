"use client";

import { Menu, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NAV_LOGO = {
  url: "https://orchids.app",
  src: "/orchids-logo.png",
  alt: "KarigarSetu logo",
  title: "KarigarSetu",
};
const NAV_ITEMS = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const AnimatedIndicatorNavbar = () => {
  const [activeItem, setActiveItem] = useState(NAV_ITEMS[0].name);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = document.querySelector(
        `[data-nav-item="${activeItem}"]`
      ) as HTMLElement;

      if (activeEl && indicatorRef.current && menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const itemRect = activeEl.getBoundingClientRect();

        indicatorRef.current.style.width = `${itemRect.width}px`;
        indicatorRef.current.style.left = `${itemRect.left - menuRect.left}px`;
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeItem]);

  return (
    <section className="py-4 bg-background border-b border-border">
      <nav className="container mx-auto flex items-center justify-between">
        {/* Left WordMark */}
        <a href={NAV_LOGO.url} className="flex items-center gap-2">
          <img src={NAV_LOGO.src} className="max-h-8 w-8" alt={NAV_LOGO.alt} />
          <span className="text-lg font-semibold tracking-tighter text-foreground font-display">
            {NAV_LOGO.title}
          </span>
        </a>

        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList
            ref={menuRef}
            className="rounded-4xl flex items-center gap-6 px-8 py-3"
          >
            {NAV_ITEMS.map((item) => (
              <React.Fragment key={item.name}>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    data-nav-item={item.name}
                    onClick={() => setActiveItem(item.name)}
                    className={`relative cursor-pointer text-sm font-medium hover:bg-transparent transition-colors ${
                      activeItem === item.name
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </React.Fragment>
            ))}
            {/* Active Indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-2 flex h-1 items-center justify-center px-2 transition-all duration-300"
            >
              <div className="bg-primary h-0.5 w-full rounded-t-none transition-all duration-300" />
            </div>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Popover */}
        <MobileNav activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="outline"
            size="sm"
            className="h-10 py-2.5 text-sm font-normal border-border text-foreground hover:bg-muted"
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="h-10 py-2.5 text-sm font-normal bg-primary text-primary-foreground hover:bg-marketplace-secondary"
          >
            Sign Up
          </Button>
        </div>
      </nav>
    </section>
  );
};

export { AnimatedIndicatorNavbar };

const AnimatedHamburger = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="group relative h-6 w-6">
      <div className="absolute inset-0">
        <Menu
          className={`text-muted-foreground group-hover:text-foreground absolute transition-all duration-300 ${
            isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        />
        <X
          className={`text-muted-foreground group-hover:text-foreground absolute transition-all duration-300 ${
            isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

const MobileNav = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block lg:hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <AnimatedHamburger isOpen={isOpen} />
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="relative -left-4 -top-4 block w-screen max-w-md overflow-hidden rounded-xl p-0 lg:hidden bg-background border-border"
        >
          <ul className="bg-background text-foreground w-full py-4">
            {NAV_ITEMS.map((navItem, idx) => (
              <li key={idx}>
                <a
                  href={navItem.link}
                  onClick={() => setActiveItem(navItem.name)}
                  className={`flex items-center border-l-[3px] px-6 py-4 text-sm font-medium transition-all duration-75 ${
                    activeItem === navItem.name
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`}
                >
                  {navItem.name}
                </a>
              </li>
            ))}
            <li className="flex flex-col gap-2 px-7 py-2">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">Sign In</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-marketplace-secondary">Sign Up</Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};