import React from "react";

export const CurrencyInfo = ({ currency, onClick }) => {
  console.log("CURRENCY ", currency);
  if (!currency) return null;
  return (
    <div className="currency_info_wrapper" onClick={onClick}>
      <img alt="chosen currency logo" src={currency.image} />
      {currency.ticker?.toUpperCase()}
    </div>
  );
};
