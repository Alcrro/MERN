import React from "react";
import "./FisaCalitate.css";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";

const FisaCalitate = () => {
  const [nrPrint, setNrPrint] = useState(1);
  const nrIncrementare = 1;
  const locatieProdus = "Ardud";
  const nrLinie = [1, 2, 3];
  const client = "Belgrad Rakpart";
  const codArticol = "79035523";
  const descriere = "semi valva con sorpresa kinder joy harry potter";
  const denumire = "cl1 c";
  const cantitate = 7920;
  const module = "";
  const sorpresa = 5760;
  const turno = ["1", "2", "3"];
  const data = new Date();
  const lottNumber = "pl2-0259-t";
  const esitoCollaudo = "L073T-B";
  const madeIn = "Made in Romania";

  let printArray = [];
  for (let i = 1; i < nrPrint; i++) {
    printArray.push(i);
  }
  console.log(printArray);

  return (
    <>
      <div className="fisa-calitate-container print">
        <input type="text" onChange={(e) => setNrPrint(e.target.value)} />
        <button onClick={() => window.print()}>Print</button>
      </div>
      {printArray?.map((item, key) => (
        <div className="fisa-calitate-container" key={key}>
          <h1>Fisa Calitate</h1>
          <div className="primul-rand">
            <div className="numar-produs">Nr pedane: {item}</div>
            <div className="numar-produs2">
              nr macchina: {nrLinie[0]} / {nrLinie[1]} / {nrLinie[2]}
            </div>
          </div>
          <div className="locatie-executie">
            <div className="locatie-exec">{locatieProdus}</div>
          </div>
          <div className="client">
            <div className="client-nr"> {client}</div>
          </div>
          <div className="cod-articol">
            <div className="cod-articol-nr">{codArticol}</div>
          </div>
          <div className="descriere">
            <div className="descriere-nr">
              Descriere:
              <span>{descriere}</span>
            </div>
          </div>
          <div className="denumire">
            <div className="denumire-nr">{denumire}</div>
          </div>
          <div className="both-sides">
            <div className="left-side">
              <div className="cantitate">
                <div className="cantitate-nr">Cantitate: {cantitate}</div>
                <div className="module-nr">Module: {module}</div>
                <div className="sorprese">Sorprese: {sorpresa}</div>
              </div>
            </div>
            <div className="right-side">
              <div className="turno">
                <div className="turno-nr">
                  Turno: {turno[0]} / {turno[1]} / {turno[2]}
                </div>
                <div className="data-nr">Data: {data.toLocaleDateString()}</div>
                <div className="lot-nr">Lot: {lottNumber}</div>
                <div className="esito-nr">Esito collaudo: {esitoCollaudo}</div>
              </div>
            </div>
          </div>
          <div className="made-in">
            <div className="made-in-nr">{madeIn}</div>
          </div>
        </div>
      ))}
      {/* <div className="fisa-calitate-container">
        <h1>Fisa Calitate</h1>
        <div className="primul-rand">
          <div className="numar-produs">Nr pedane: {nrPrint}</div>
          <div className="numar-produs2">
            nr macchina: {nrLinie[0]} / {nrLinie[1]} / {nrLinie[2]}
          </div>
        </div>
        <div className="locatie-executie">
          <div className="locatie-exec">{locatieProdus}</div>
        </div>
        <div className="client">
          <div className="client-nr"> {client}</div>
        </div>
        <div className="cod-articol">
          <div className="cod-articol-nr">{codArticol}</div>
        </div>
        <div className="descriere">
          <div className="descriere-nr">
            Descriere:
            <span>{descriere}</span>
          </div>
        </div>
        <div className="denumire">
          <div className="denumire-nr">{denumire}</div>
        </div>
        <div className="both-sides">
          <div className="left-side">
            <div className="cantitate">
              <div className="cantitate-nr">Cantitate: {cantitate}</div>
              <div className="module-nr">Module: {module}</div>
              <div className="sorprese">Sorprese: {sorpresa}</div>
            </div>
          </div>
          <div className="right-side">
            <div className="turno">
              <div className="turno-nr">
                Turno: {turno[0]} / {turno[1]} / {turno[2]}
              </div>
              <div className="data-nr">Data: {data.toLocaleDateString()}</div>
              <div className="lot-nr">Lot: {lottNumber}</div>
              <div className="esito-nr">Esito collaudo: {esitoCollaudo}</div>
            </div>
          </div>
        </div>
        <div className="made-in">
          <div className="made-in-nr">{madeIn}</div>
        </div> */}
    </>
  );
};

export default FisaCalitate;
