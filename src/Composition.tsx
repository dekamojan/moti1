import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { ParallaxBackground } from "./components/ParallaxBackground";
import { Subtitles } from "./components/Subtitles";
import { KineticText } from "./components/KineticText";
import { GlassPanel } from "./components/GlassPanel";
import { ProgressBar } from "./components/ProgressBar";
import { Particles } from "./components/Particles";
import { CallToAction } from "./components/CallToAction";
import { parseSrt } from "./utils/parse-srt";
import { VIDEO } from "./config";
import path from "path";

// Parse SRT at bundle time (Node-side)
const SRT_PATH = path.join(process.cwd(), "public", "subs.srt");
const segments = parseSrt(SRT_PATH, VIDEO.fps);

export const MainComposition: React.FC = () => {
  // Rotate kinetic text styles per scene
  const kineticStyles: Array<"bounce" | "scale" | "wave" | "typewriter"> = [
    "bounce",
    "scale",
    "wave",
    "typewriter",
    "bounce",
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Layer 1: Video background with parallax */}
      <ParallaxBackground src={staticFile("video.mp4")} />

      {/* Layer 2: Floating particles */}
      <Particles />

      {/* Layer 3: Kinetic text headlines inside glass panels */}
      {segments.map((seg, i) => (
        <GlassPanel
          key={`panel-${seg.id}`}
          enterFrame={seg.startFrame}
          exitFrame={seg.endFrame}
          position={i % 2 === 0 ? "center" : "top"}
          width="85%"
        >
          <KineticText
            text={seg.text}
            enterFrame={seg.startFrame}
            exitFrame={seg.endFrame}
            fontSize={i === segments.length - 1 ? 36 : 40}
            style={kineticStyles[i % kineticStyles.length]}
          />
        </GlassPanel>
      ))}

      {/* Layer 4: Subtitles with word-by-word highlight */}
      <Subtitles segments={segments} />

      {/* Layer 5: CTA button on last segment */}
      {segments.length > 0 && (
        <CallToAction
          text="🛒 CHECKOUT SEKARANG!"
          enterFrame={segments[segments.length - 1].startFrame + 10}
          exitFrame={segments[segments.length - 1].endFrame}
        />
      )}

      {/* Layer 6: Audio - voiceover */}
      <Audio src={staticFile("audio.mp3")} volume={VIDEO.voVolume} />

      {/* Layer 7: Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
