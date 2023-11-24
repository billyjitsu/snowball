/* eslint-disable react/no-unescaped-entities */
import React from "react";

const Loading = () => {
  return (
    <div className="relative flex flex-col text-white items-center justify-center mb-10 md:mb-0 h-screen w-full">
      <div className="absolute flex flex-col items-center justify-center">
        <h2 className="text-white text-center justify-center text-3xl font-bold animate-pulse mb-10 md:mb-0 w-full drop-shadow-[0_2.2px_1.2px_rgba(0,0,0,0.8)]">
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default Loading;
