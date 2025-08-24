"use client";

import { Menu, X, ShoppingCart, Store, Palette, Home, Info, Phone } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";

const NAV_LOGO = {
  url: "/",
  src: "https://cdn.builder.io/api/v1/image/assets%2Fa3656e61a5694931a58316df40a95cae%2Ff3112465dbef47929828fdde4e76efaa?format=webp&width=800",
  alt: "KarigarSetu logo",
  title: "KarigarSetu",
};
const NAV_ITEMS = [
  { name: "Home", link: "/", icon: <Home className="w-4 h-4" /> },
  { name: "Explore", link: "/explore", icon: <Store className="w-4 h-4" /> },
  { name: "Exhibition", link: "/exhibition", icon: <Palette className="w-4 h-4" /> },
  { name: "About", link: "/about", icon: <Info className="w-4 h-4" /> },
  { name: "Contact", link: "/contact", icon: <Phone className="w-4 h-4" /> },
];

const AnimatedIndicatorNavbar = () => {
  const [activeItem, setActiveItem] = useState(NAV_ITEMS[0].name);
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();

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
        <a href={NAV_LOGO.url} className="flex items-center gap-4">
          <img src={NAV_LOGO.src} className="max-h-20 w-20 md:max-h-24 md:w-24" alt={NAV_LOGO.alt} />
          <span className="text-xl font-bold tracking-tighter text-amber-800 font-display">
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
                    href={item.link}
                    onClick={() => setActiveItem(item.name)}
                    className={`relative cursor-pointer text-sm font-medium hover:bg-transparent transition-colors flex items-center gap-2 ${activeItem === item.name
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {item.icon && item.icon}
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
        <MobileNav activeItem={activeItem} setActiveItem={setActiveItem} user={user} isAuthenticated={isAuthenticated} />

        <div className="hidden items-center gap-3 lg:flex">
          {/* Cart Icon - Only show for users, not artisans */}
          {(!isAuthenticated || (user && user.type === "user")) && (
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 w-10 p-0 hover:bg-muted"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                {/* Cart counter badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {isAuthenticated && user ? (
            <UserProfileDropdown user={user} />
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 py-2.5 text-sm font-normal border-border text-foreground hover:bg-muted"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-10 py-2.5 text-sm font-normal bg-primary text-primary-foreground hover:bg-marketplace-secondary"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
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
          className={`text-muted-foreground group-hover:text-foreground absolute transition-all duration-300 ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
        />
        <X
          className={`text-muted-foreground group-hover:text-foreground absolute transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
        />
      </div>
    </div>
  );
};

const MobileNav = ({
  activeItem,
  setActiveItem,
  user,
  isAuthenticated,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
  user: any;
  isAuthenticated: boolean;
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
                  className={`flex items-center gap-3 border-l-[3px] px-6 py-4 text-sm font-medium transition-all duration-75 ${activeItem === navItem.name
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                    }`}
                >
                  {navItem.icon && navItem.icon}
                  {navItem.name}
                </a>
              </li>
            ))}

            {/* Mobile Cart - Only show for users, not artisans */}
            {(!isAuthenticated || (user && user.type === "user")) && (
              <li className="border-l-[3px] border-transparent px-6 py-4">
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative w-full justify-start gap-3 h-10"
                    aria-label="Shopping Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute right-3 top-2 h-5 w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </li>
            )}

            {isAuthenticated && user ? (
              <li className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <UserProfileDropdown user={user} />
                </div>
              </li>
            ) : (
              <li className="flex flex-col gap-2 px-7 py-2">
                <Link href="/signin">
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-marketplace-secondary">
                    Sign Up
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};
