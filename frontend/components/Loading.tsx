/* eslint-disable react/no-unescaped-entities */
import React from "react";

interface LoadingProps {
  action?: string
}

const Loading = ({ action }: LoadingProps) => {
  return (
    <div className="mx-auto p-0">
      <iframe className="text-center mx-auto" src="https://lottie.host/embed/c43b6a08-d090-4389-8911-590f82decbeb/ziMZcQuzz9.json"></iframe>
      <p className="text-center font-bold text-white">{action ?? "...loading"}</p>
    </div>
  );
};

export default Loading;
