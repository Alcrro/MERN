import React from "react";

const PrintNumbersFrom1To10 = () => {
  const numbers = [];
  for (let i = 1; i <= 10; i++) {
    numbers.push(i + ", ");
  }
  return numbers;
};

const PrintTheOddNumbersLessThan100 = () => {
  const odd = [];
  let last_item;
  for (let i = 1; i < 100; i++) {
    if (i % 2 === 0) {
      odd.push(i + ", ");
    }
  }
  last_item = odd[odd.length - 1];

  return odd + "Last item from array " + last_item;
};

const Exercise = () => {
  return (
    <div className="container">
      <div className="print1to10">
        1. PrintNumbersFrom1To10: <PrintNumbersFrom1To10 />
      </div>
      <br />
      <div className="printOddNum">
        2. PrintTheOddNumbersLessThan100: <PrintTheOddNumbersLessThan100 />
      </div>
    </div>
  );
};

export default Exercise;
