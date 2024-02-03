import dynamic from "next/dynamic";
import { useState } from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(!hover)}
        onMouseLeave={() => setHover(!hover)}
        className="relative bg-gray-500 hover:bg-gray-700 border border-white text-white font-bold py-2 px-4 rounded my-4 overflow-hidden"
      >
        {hover && <iframe
          src="https://lottie.host/embed/973d8985-c200-4029-a5fb-a17c4ceeb3bf/yBF3l74Ugu.json"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: 'none',
            pointerEvents: 'none', // Ensures that the iframe doesn't intercept mouse events
          }}
        ></iframe>}
        <p className="text-center z-10 relative">{text}</p>
      </button>
    </>
  )
}

// export default Fight;
export default dynamic(() => Promise.resolve(Button), { ssr: false });
