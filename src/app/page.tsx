import ToggleSection from "../components/ToggleSection";
import LogosShowcase from "../components/LogosShowcase";
import VideoExplainer from "../components/VideoExplainer";
import ThreeFeatures from "../components/ThreeFeatures";
import MentorsSection from "../components/MentorsSection";
import PlatformStats from "../components/PlatformStats";
import CenterCTA from "../components/CenterCTA"
import {Spinner} from "@heroui/spinner";
export default function Home() {
  return (
   
   <div>
      <ToggleSection />
      <LogosShowcase />
      <VideoExplainer />
      <ThreeFeatures />
      <MentorsSection />
      <PlatformStats />
      <CenterCTA />
    </div>
  );
}
