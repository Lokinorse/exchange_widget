import React from "react";
import { CurrencyInfo } from "./CurrencyInfo";

export const DropdownList = ({ options, handleOptionClick, value, closed }) => {
  //{`select_wrapper ${isOpen && "select_wrapper_opened"}`}
  return (
    <div
      className={`dropdown_list_wrapper ${
        closed ? "dropdown_closed" : "dropdown_opened"
      }`}
    >
      {options.map((currency) => (
        <div
          className={"dropdown_single_item"}
          key={currency.ticker}
          onClick={() => handleOptionClick(currency)}
        >
          <CurrencyInfo currency={currency} />
          <div className="currency_full_title">{currency.name}</div>
        </div>
      ))}
    </div>
  );
};

{
  /* <div
key={option.name}
className={`option ${value === option.value ? "selected" : ""}`}
onClick={() => handleOptionClick(option)}
>
{option.name}
</div> */
}
