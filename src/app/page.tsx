import { Hero } from "@/components/hero";
import { MissionVision } from "@/components/mission-vision";
import { PhotoGallery } from "@/components/photo-gallery";
import { SplitSection } from "@/components/split-section";

export default function Home() {
   return (
      <div>
         <Hero />
         <MissionVision />
         {/* <PhotoGallery /> */}
         <SplitSection />
      </div>
   );
}
