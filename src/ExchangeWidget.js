"use client";
import React, { useState, useEffect } from "react";
import { Select } from "./app/components/Select/Select";
import { HorisontalArrow } from "./app/components/Icons/HorisontalArrow";
import { ClearIcon } from "./app/components/Icons/ClearIcon";
//List of available currencies; https://api.changenow.io/v1/currencies?active=true&fixedRate=true
//Minimal exchange amount; https://api.changenow.io/v1/min-amount/:from_to?api_key=your_api_key
//Estimated exchange amount https://api.changenow.io/v1/exchange-amount/:send_amount/:from_to/?api_key=your_api_key

export const ExchangeWidget = () => {
  const apiKey = process.env.API_KEY;
  const [currencies, setCurrencies] = useState([]);
  const [sourceResults, setSourceResults] = useState([]);
  const [targetResults, setTargetResults] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [sourceAmount, setSourceAmount] = useState(0);
  const [targetAmount, setTargetAmount] = useState("");
  const [searchVal, onChangeSearch] = useState({ source: "", target: "" });
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    fetchCurrencies();
  }, []);

  // функцию не выношу за пределы компонента - чтобы не передавать 3 дополнительных аргумента, а брать их сразу из области видимости (обсуждаемо)
  // функция может быть сильно проще и читаемей, но я хочу использовать ранний выход из цикла, если мы нашли 3
  // (максимум в нашем отображении) подходящих монеты. плюс к этому - если в одном из инпутов выбрана монета - её по дефолту
  // не отображается в другом инпуте (но её всё ещё можно найти по прямому поиску текстом)
  const getSearchResults = (targetOrSource) => {
    const searchValue =
      targetOrSource === "source" ? searchVal.source : searchVal.target;
    const setStateCb =
      targetOrSource === "source" ? setSourceResults : setTargetResults;
    const oppositeCurrency =
      targetOrSource === "source" ? targetCurrency : sourceCurrency;
    const filteredSearchResults = [];
    for (const coin of currencies) {
      if (!searchValue) {
        if (coin.name !== oppositeCurrency.name)
          filteredSearchResults.push(coin);
      } else {
        if (coin.name.toUpperCase().includes(searchValue.toUpperCase())) {
          filteredSearchResults.push(coin);
        }
      }
      if (filteredSearchResults.length > 2) break;
    }
    setStateCb(filteredSearchResults);
  };

  useEffect(() => {
    getSearchResults("source");
    getSearchResults("target");
  }, [currencies, searchVal, targetCurrency, sourceCurrency]);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(
        "https://api.changenow.io/v1/currencies?active=true&fixedRate=true"
      );
      const data = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sourceCurrency || !targetCurrency) return;
    updateMinAmount();
  }, [sourceCurrency, targetCurrency]);

  useEffect(() => {
    if (!sourceCurrency || !targetCurrency || !sourceAmount) return;
    updateTargetAmount();
  }, [sourceCurrency, targetCurrency, sourceAmount]);

  const updateTargetAmount = async () => {
    try {
      const response = await fetch(
        `https://api.changenow.io/v1/exchange-amount/${sourceAmount}/${sourceCurrency.ticker}_${targetCurrency.ticker}/?api_key=${apiKey}`
      );
      const data = await response.json();
      setTargetAmount(data.estimatedAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const updateMinAmount = async () => {
    try {
      const response = await fetch(
        `https://api.changenow.io/v1/min-amount/${sourceCurrency.ticker}_${targetCurrency.ticker}?api_key=y${apiKey}`
      );
      const data = await response.json();
      setSourceAmount(data.minAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeSourceCurrency = (option) => {
    setSourceCurrency(option);
  };

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
          />
        </div>
        <div className="exchange_arrows_wrapper">
          <HorisontalArrow />
          <HorisontalArrow reverse />
        </div>
        <div className="select_currency">
          <Select
            options={targetResults}
            value={targetCurrency}
            onChange={setTargetCurrency}
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
        <button className="exchange_button" onClick={() => console.log(1)}>
          EXCHANGE
        </button>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};
