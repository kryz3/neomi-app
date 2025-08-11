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
        <header className="w-full h-16 flex items-center justify-between px-8 bg-white shadow-sm uppercase font-medium ">
            <Link href="/" className="flex items-center">
                <img src="/neomi-logo.png" alt="Neomi Logo" className="w-24 h-auto"/>
            </Link>
            
            <nav className="flex items-center space-x-6">
                {liens.map((link) => (
                    <Link 
                        href={link.href} 
                        key={link.href} 
                        className={`hover:text-primary text-secondary transition-colors ${
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