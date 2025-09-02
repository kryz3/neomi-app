import FaqClient from "@/app/components/FaqClient";
import RainbowBackground from "@/app/components/RainbowBackground";

export const metadata = {
  title: "FAQ - Neomi",
  description: "Bienvenue sur la foire aux questions de Neomi",
};

export default function Faq() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 snap-start">
      {/* Rainbow background qui suit le contenu */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <RainbowBackground className="opacity-20" />
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10">
        <FaqClient />
      </div>
    </div>
  );
}