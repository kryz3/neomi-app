
import "./globals.css";
import Header from "./components/Header";
import { ViewTransitions } from 'next-view-transitions';
import Footer from "./components/Footer";


export const metadata = {
  title: {
    template: '%s',
    default: 'Neomi - Solutions innovantes',
  },
  description: "Neomi - Votre partenaire pour des solutions innovantes et personnalisées",
  keywords: ["Neomi", "solutions", "services", "innovation"],
  authors: [{ name: "Neomi" }],
  creator: "Neomi",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Neomi',
  },
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
    <html lang="fr">
      <body className="scroll-smooth">
        <Header/>
        <main className="snap-y snap-mandatory" style={{ height: "calc(100vh - 4rem)", overflowY: "auto" }}>
          {children}
                  <Footer/>
        </main>

      </body>
    </html>
    </ViewTransitions>
  );
}
