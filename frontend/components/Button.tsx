import dynamic from "next/dynamic";
import { useState } from "react";

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({ text, onClick, disabled, className }: ButtonProps) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`relative bg-gray-500 border border-white text-white font-bold py-2 px-4 rounded my-4 overflow-hidden ${disabled ? '' : 'hover:bg-gray-700'} ` + className}
      >
        <p className="text-center z-10 relative">{text}</p>
      </button>
    </div>
  )
}

// export default Fight;
export default dynamic(() => Promise.resolve(Button), { ssr: false });
