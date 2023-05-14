import React from "react";

export const HorisontalArrow = ({ reverse }) => {
  return (
    <svg
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        transform={reverse ? "translate(16, 0) scale(-1, 1)" : ""}
        d="M12.01 3H0V5H12.01V8L16 4L12.01 0V3Z"
        fill="#11B3FE"
      />
    </svg>
  );
};
