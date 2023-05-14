"use client";
import React, { useState, useEffect } from "react";
import { Select } from "../components/Select/Select";
import { HorisontalArrow } from "../components/Icons/HorisontalArrow";
import { useLogic } from "./useLogic";
//List of available currencies; https://api.changenow.io/v1/currencies?active=true&fixedRate=true
//Minimal exchange amount; https://api.changenow.io/v1/min-amount/:from_to?api_key=your_api_key
//Estimated exchange amount https://api.changenow.io/v1/exchange-amount/:send_amount/:from_to/?api_key=your_api_key

export const ExchangeWidget = () => {
  const {
    sourceResults,
    sourceCurrency,
    onChangeSourceCurrency,
    sourceAmount,
    setSourceAmount,
    searchVal,
    onChangeSearch,
    errorMessage,
    targetResults,
    targetCurrency,
    onChangeTargetCurrency,
    targetAmount,
    disabledPair,
  } = useLogic();
  return (
    <div className="widget_wrapper">
      <h1>Crypto exchange</h1>
      <h3>Exchange fast and easy</h3>
      <div className="selects_wrapper">
        <div className="select_currency">
          <Select
            options={sourceResults}
            value={sourceCurrency}
            onChange={onChangeSourceCurrency}
            amount={sourceAmount}
            onChangeAmount={setSourceAmount}
            searchVal={searchVal.source}
            onChangeSearch={(val) =>
              onChangeSearch((prev) => ({ ...prev, source: val }))
            }
          >
            <div className="error_message">{errorMessage}</div>
          </Select>
        </div>
        <div className="exchange_arrows_wrapper">
          <HorisontalArrow />
          <HorisontalArrow reverse />
        </div>
        <div className="select_currency">
          <Select
            isInvalid={!!errorMessage}
            options={targetResults}
            value={targetCurrency}
            onChange={onChangeTargetCurrency}
            amount={targetAmount}
            disabled
            searchVal={searchVal.target}
            onChangeSearch={(val) =>
              onChangeSearch((prev) => ({ ...prev, target: val }))
            }
          />
        </div>
      </div>
      <div className="action_wrapper">
        <div className="address_input_wrapper">
          <label>{`Your ${sourceCurrency.name || "wallet"} address`}</label>
          <div className="select_wrapper">
            <input className="transparent_input" type="text" />
          </div>
        </div>
        <button
          disabled={
            !sourceCurrency ||
            !targetCurrency ||
            !!errorMessage ||
            !!disabledPair
          }
          className="exchange_button"
          onClick={() => {
            const result = window.confirm("Are you sure you want to proceed?");
            if (result) {
              window.open(
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "_blank"
              );
            }
          }}
        >
          EXCHANGE
          <div className="error_message">{disabledPair}</div>
        </button>
      </div>
    </div>
  );
};
