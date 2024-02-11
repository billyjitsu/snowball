/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef } from "react";
import * as LottiePlayer from "@lottiefiles/lottie-player";
import attackMain1 from "../components/lotties/attack1.json"
import attackMain from "../components/lotties/attack.json"
import swords from "../components/lotties/swords.json"
interface LoadingProps {
  action?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loading = ({ action, size }: LoadingProps) => {
  const ref = useRef(null);
  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const maxWidths = {
    'sm': "100",
    'md': "200",
    'lg': "300"
  }

  return (
    <div className={`p-0 text-mx-auto text-center`}>
      <lottie-player
        id="firstLottie"
        ref={ref}
        autoplay
        loop
        mode="Bounce"
        className={`${maxWidths['sm']}`}
        src={JSON.stringify(action?.toLowerCase() === "attacking" ? attackMain1 : swords)}
        style={{ width: `${maxWidths[size || "sm"]}px`, height: `${maxWidths[size || "sm"]}px`, margin: "0 auto" }}
      ></lottie-player>
      <p className={`text-${size ?? 'md'} text-center font-bold text-white`}>{action ?? "...loading"}</p>
    </div>
  );
};

export default Loading;
