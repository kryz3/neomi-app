import Image from "next/image"
import { Link } from "next-view-transitions";

export default function Footer() {

    return(
        <footer className="w-full bg-primary text-white snap-start">
            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Section principale */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Call to action */}
                    <div className="md:col-span-2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-accent">
                            Prêt à vous lancer ?
                        </h2>

                        <Link 
                            href="/contact"
                            className="inline-block bg-accent text-ligh px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Demander un devis !
                        </Link>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-4 text-center md:text-right">
                        <h3 className="text-xl font-semibold mb-4 text-accent">
                            Nous contacter
                        </h3>
                        <div className="space-y-3">
                            <a 
                                href="mailto:contact@neomi.fr"
                                className="flex items-center gap-3 text-white/90 hover:text-accent transition-colors duration-300 justify-center md:justify-end"
                            >
                                <span className="text-lg order-2 md:order-1">contact@neomi.fr</span>

                            </a>
                            <a 
                                href="tel:+33678296028"
                                className="flex items-center gap-3 text-white/90 hover:text-accent transition-colors duration-300 justify-center md:justify-end"
                            >
                                <span className="text-lg order-2 md:order-1">+33 6 78 29 60 28</span>

                            </a>
                        </div>
                    </div>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-white/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-4 ">
                            <Link href="/">
                            <Image 
                                src="/neomi-logo-blanc.webp" 
                                width="150" 
                                height="150" 
                                alt="Neomi logo"
                                className=" transition-all transform duration-300 hover:-translate-y-1 "
                                href="/"

                            />
                            </Link>

                        </div>

                        {/* Réseaux sociaux */}
                        <div className="flex items-center gap-4">
                            <a 
                                href="https://www.linkedin.com/company/neomi/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-accent text-primary p-3 rounded-full hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>

                        {/* Copyright */}
                        <div className="text-center md:text-right text-white/70">
                            <p className="text-sm">
                                <strong>Copyright</strong> &copy; {new Date().getFullYear()} <strong className="text-accent">NEOMI</strong>
                            </p>
                            <p className="text-xs mt-1">
                                Développé par <a target="_blank" href="https://www.linkedin.com/in/pjgirault/">Paul-Jean GIRAULT</a> 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}