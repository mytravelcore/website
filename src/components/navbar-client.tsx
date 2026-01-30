"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";

interface NavbarClientProps {
  user: any;
  userProfile: React.ReactNode;
}

export default function NavbarClient({ user, userProfile }: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isPastSecondBlock, setIsPastSecondBlock] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const secondBlockThreshold = heroHeight + 400; // After hero + search section + some of value props

      // Determine if scrolled past hero (for background change)
      setIsScrolled(currentScrollY > 50);

      // Determine if past second block (for hide/show behavior)
      const pastSecondBlock = currentScrollY > secondBlockThreshold;
      setIsPastSecondBlock(pastSecondBlock);

      // Show/hide navbar based on scroll direction (only after second block)
      if (pastSecondBlock) {
        if (currentScrollY < lastScrollY) {
          // Scrolling up - show navbar
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > secondBlockThreshold + 100) {
          // Scrolling down - hide navbar
          setIsVisible(false);
        }
      } else {
        // Before second block - always visible
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-tc-purple-light/20 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={isScrolled 
                ? "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a3842c1004185996b7fbc7.png"
                : "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a3842c2e34b77b4a61cef6.png"
              }
              alt="TravelCore"
              width={120}
              height={33}
              className="h-8 w-auto transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            <Link
              href="/"
              className={`transition-colors font-medium ${
                isScrolled
                  ? "text-tc-purple-deep hover:text-tc-orange"
                  : "text-white hover:text-tc-yellow drop-shadow-md"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/tours"
              className={`transition-colors font-medium ${
                isScrolled
                  ? "text-tc-purple-deep hover:text-tc-orange"
                  : "text-white hover:text-tc-yellow drop-shadow-md"
              }`}
            >
              Tours
            </Link>
            <Link
              href="/destinos"
              className={`transition-colors font-medium ${
                isScrolled
                  ? "text-tc-purple-deep hover:text-tc-orange"
                  : "text-white hover:text-tc-yellow drop-shadow-md"
              }`}
            >
              Destinos
            </Link>
            <Link
              href="/contacto"
              className={`transition-colors font-medium ${
                isScrolled
                  ? "text-tc-purple-deep hover:text-tc-orange"
                  : "text-white hover:text-tc-yellow drop-shadow-md"
              }`}
            >
              Contacto
            </Link>
            <Link
              href="/quienes-somos"
              className={`transition-colors font-medium ${
                isScrolled
                  ? "text-tc-purple-deep hover:text-tc-orange"
                  : "text-white hover:text-tc-yellow drop-shadow-md"
              }`}
            >
              Sobre nosotros
            </Link>
            <Link
              href="/portal"
              className={`transition-colors font-medium ${
                isScrolled
                  ? "text-tc-purple-deep hover:text-tc-orange"
                  : "text-white hover:text-tc-yellow drop-shadow-md"
              }`}
            >
              Portal
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className={`${
                      isScrolled
                        ? "border-tc-purple-deep text-tc-purple-deep hover:bg-tc-purple-deep hover:text-white"
                        : "border-white text-white hover:bg-white hover:text-tc-purple-deep"
                    }`}
                  >
                    Dashboard
                  </Button>
                </Link>
                {userProfile}
              </>
            ) : (
              <>


              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${
              isScrolled ? "text-tc-purple-deep" : "text-white"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
