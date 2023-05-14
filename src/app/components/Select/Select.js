import React, { useState } from "react";
import { ArrowIcon } from "../Icons/ArrowIcon";
import { DropdownList } from "./DropdownList";
import { CurrencyInfo } from "./CurrencyInfo";
import { ClearIcon } from "./ClearIcon";
import { SearchBar } from "./SearchBar";

export const Select = ({
  children,
  options,
  value,
  onChange,
  amount,
  onChangeAmount,
  disabled,
  searchVal,
  onChangeSearch,
  isInvalid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
    onChangeSearch("");
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`select_wrapper ${isOpen ? "select_wrapper_opened" : ""}`}>
      <div className="select_amount">
        {isOpen && (
          <SearchBar
            value={searchVal}
            onChange={onChangeSearch}
            type={"text"}
          />
        )}
        {!isOpen && value && (
          <>
            {isInvalid ? (
              <div className="invalid_dash" />
            ) : (
              <SearchBar
                value={amount}
                onChange={onChangeAmount}
                type={"number"}
                disabled={disabled}
              />
            )}
          </>
        )}
      </div>
      <div className="select_left_part">
        {!isOpen && <CurrencyInfo currency={value} />}
        <div className="dropdown_arrow_wrapper" onClick={handleToggle}>
          <ClearIcon show={isOpen} />
          <ArrowIcon show={!isOpen} />
        </div>
      </div>
      <DropdownList
        options={options}
        handleOptionClick={handleOptionClick}
        value={value}
        closed={!isOpen}
      />
      {children}
    </div>
  );
};
