'use client';

import { Link } from "next-view-transitions";

import { useActiveRoute } from "../hooks/useActiveRoute";

export default function Header() {
    const { isActive } = useActiveRoute();

    const liens = [
        { href: "/about", label: "À propos"},
        { href: "/secteurs", label: "Secteurs"},
        { href: "/services", label: "Services"},
        { href: "/blog", label: "Blog"},
        { href: "/contact", label: "Contact"},
    ];

    return(
        <header className=" z-999 w-full h-16 fixed top-0 flex items-center justify-between px-8 backdrop-blur-sm bg-light shadow-sm uppercase font-medium">
            <Link href="/" className="flex items-center h-full ">
                <img src="/neomi-logo.png" alt="Neomi Logo" className="sm:h-20 h-12  w-auto"/>
            </Link>
            
            <nav className="flex items-center space-x-6 h-full">
                {liens.map((link) => (
                    <Link 
                        href={link.href} 
                        key={link.href} 
                        className={`text-xs sm:text-base hover:text-primary text-secondary transition-colors flex items-center h-full ${
                            isActive(link.href) 
                                ? "text-accent font-semibold" 
                                : "text-gray-700"
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    )
}