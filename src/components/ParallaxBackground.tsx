import React from "react";
import { Video, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Props {
  src: string;
}

export const ParallaxBackground: React.FC<Props> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow zoom-in parallax (1.0 → 1.12 over full duration)
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.12], {
    extrapolateRight: "clamp",
  });

  // Subtle vertical pan (-2% → +2%)
  const translateY = interpolate(frame, [0, durationInFrames], [-2, 2], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Video
        src={src}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateY(${translateY}%)`,
        }}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
