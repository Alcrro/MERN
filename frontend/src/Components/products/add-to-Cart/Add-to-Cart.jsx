import React, { useState } from "react";

const AddToCart = () => {
  const numar = 5;
  let lista = [];
  let lista2 = [];
  let lista3 = [];

  for (let i = 1; i <= numar; i++) {
    let element = i;
    // console.log(element);
    lista.push(element);
    for (let j = 1; j <= 11; j++) {
      const element2 = element;
      // console.log(element2);
      lista2.push(element2);
      if (element2 % element === 0) {
        console.log(`element: ${element};  element2 ${element2}`);
      }
    }
  }
  // console.log(lista);
  // console.log(lista2);
  console.log(lista2);

  return <div></div>;
};

export default AddToCart;
