import dynamic from 'next/dynamic';

const ToggleSection = dynamic(() => import("../components/ToggleSection"), { loading: () => <div>Loading...</div> });
const LogosShowcase = dynamic(() => import("../components/LogosShowcase"), { loading: () => <div>Loading logos...</div> });
const ThreeFeatures = dynamic(() => import("../components/ThreeFeatures"), { loading: () => <div>Loading features...</div> });
const VideoExplainer = dynamic(() => import("../components/VideoExplainer"), { ssr: false, loading: () => <div>Loading video...</div> });
const MentorsSection = dynamic(() => import("../components/MentorsSection"), { ssr: false, loading: () => <div>Loading mentors...</div> });
const PlatformStats = dynamic(() => import("../components/PlatformStats"), { ssr: false, loading: () => <div>Loading stats...</div> });

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
