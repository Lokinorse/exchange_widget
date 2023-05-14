import React, { useState, useEffect } from "react";

export const useLogic = () => {
  const apiKey = process.env.API_KEY;
  const [currencies, setCurrencies] = useState([]);
  const [sourceResults, setSourceResults] = useState([]);
  const [targetResults, setTargetResults] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [sourceAmount, setSourceAmount] = useState(0);
  const [targetAmount, setTargetAmount] = useState("");
  const [sourceMinAmount, setSourceMinAmount] = useState(0);
  const [searchVal, onChangeSearch] = useState({ source: "", target: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [disabledPair, setDisabledPair] = useState(false);
  useEffect(() => {
    fetchCurrencies();
  }, []);
  // функцию не выношу за пределы хука - чтобы не передавать 3 дополнительных аргумента, а брать их сразу из области видимости (обсуждаемо)
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
    if (sourceAmount < sourceMinAmount) return;
    updateTargetAmount();
  }, [sourceCurrency, targetCurrency, sourceAmount, sourceMinAmount]);

  const updateTargetAmount = async () => {
    try {
      const response = await fetch(
        `https://api.changenow.io/v1/exchange-amount/${sourceAmount}/${sourceCurrency.ticker}_${targetCurrency.ticker}/?api_key=${apiKey}`
      );
      const data = await response.json();
      if (data.estimatedAmount === null) {
        setDisabledPair("This pair is disabled now");
        return;
      }
      setTargetAmount(data.estimatedAmount);
      setErrorMessage("");
      setDisabledPair("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (sourceMinAmount === 0 || sourceAmount === 0) return;
    if (sourceMinAmount > sourceAmount) {
      setErrorMessage("Amount is too small.");
    }
  }, [sourceMinAmount, sourceAmount]);

  const updateMinAmount = async () => {
    try {
      const response = await fetch(
        `https://api.changenow.io/v1/min-amount/${sourceCurrency.ticker}_${targetCurrency.ticker}?api_key=y${apiKey}`
      );
      const data = await response.json();
      if (data.minAmount === null) {
        setDisabledPair("This pair is disabled now");
        return;
      }
      setSourceAmount(data.minAmount);
      setSourceMinAmount(data.minAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeSourceCurrency = (option) => {
    setSourceCurrency(option);
    setSourceAmount(0);
  };

  const onChangeTargetCurrency = (option) => {
    setTargetCurrency(option);
    setSourceAmount(0);
  };
  return {
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
  };
};
