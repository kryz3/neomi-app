import ServicesComponent from "../components/Services";
import RainbowBackground from "@/app/components/RainbowBackground";

export const metadata = {
  title: "Blogs - Neomi",
  description: "Découvrez le blog de Neomi",
};

export default function Services() {
  return(
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 snap-start flex items-center justify-center">
      {/* Rainbow background qui suit le contenu */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <RainbowBackground className="opacity-20" />
      </div>
      
      {/* Contenu principal centré */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <ServicesComponent />
      </div>
    </div>
  )
}