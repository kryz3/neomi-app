'use client';
import Link from "next/link";
import { useState } from "react";
import { useActiveRoute } from "../hooks/useActiveRoute";

export default function Header() {
    const { isActive } = useActiveRoute();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const liens = [
        { href: "/secteurs", label: "Secteurs"},
        { href: "/services", label: "Services"},
        { href: "/blog", label: "Blog"},
        { href: "/faq", label: "FAQ"},
        { href: "/contact", label: "Contact"},
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return(
        <header className="z-40 w-full h-20 sticky top-0 flex items-center justify-between px-8 backdrop-blur-sm bg-light shadow-sm uppercase font-medium">
            <Link href="/" className="flex items-center h-full" onClick={closeMenu}>
                <img src="/neomi-logo.webp" alt="Neomi Logo" className="sm:h-20 h-12 w-auto"/>
            </Link>
            
            {/* Navigation desktop - cachée sur mobile */}
            <nav className="hidden md:flex items-center space-x-6 h-full">
                {liens.map((link) => (
                    <Link 
                        href={link.href} 
                        key={link.href} 
                        className={`text-xs sm:text-base hover:text-secondary text-primary transition-colors flex items-center h-full ${
                            isActive(link.href) 
                                ? "text-accent font-semibold" 
                                : "text-gray-700"
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Bouton hamburger - visible seulement sur mobile */}
            <button
                onClick={toggleMenu}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50"
                aria-label="Menu"
            >
                <span className={`w-6 h-0.5 bg-accent transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`w-6 h-0.5 bg-secondary transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`w-6 h-0.5 bg-accent transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
            </button>

            {/* Menu mobile - overlay (sans couvrir le header) */}
            <div className={`md:hidden fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`} onClick={closeMenu}></div>

            {/* Navigation mobile */}
            <nav className={`md:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-primary shadow-xl transform transition-transform duration-300 z-40 ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col p-6 space-y-4">
                    {liens.map((link) => (
                        <Link 
                            href={link.href} 
                            key={link.href}
                            onClick={closeMenu}
                            className={`text-lg py-3 px-4 rounded-lg hover:bg-secondary/10 transition-all duration-200 ${
                                isActive(link.href) 
                                    ? "text-accent font-semibold bg-accent/10" 
                                    : "text-white hover:text-primary"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    )
}