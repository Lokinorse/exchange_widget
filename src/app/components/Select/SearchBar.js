import React from "react";

export const SearchBar = ({ value, onChange, type, disabled }) => {
  return (
    <input
      disabled={disabled}
      type={type}
      placeholder={type === "text" ? "Search" : ""}
      className="transparent_input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
