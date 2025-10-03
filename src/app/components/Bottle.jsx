import { useState } from "react";
import "../../../public/css/bottle.css";
import BottleWaterLevel from "./BottleWaterLevel";

import Image from "next/image";
import bottleImage from "../../../public/images/bottle.svg";

const Bottle = ({ target, currentFluid, changeFluidAmount }) => {
  return (
    <div>
      <div className="bottlecontainer">
        <div id="bottle">
          <BottleWaterLevel levelPercent={(currentFluid / target) * 100} />
          <Image id="bottleimage" src={bottleImage} alt="A water bottle." />
        </div>

        {/* Proof of concept water level controls */}
        {/* The final controls will behave a lot differently to this ^^' */}
        <button className="fluidbutton" onClick={() => changeFluidAmount(+100)}>
          Add 50ml
        </button>
        <button className="fluidbutton" onClick={() => changeFluidAmount(-100)}>
          Remove 50ml
        </button>
      </div>
      <p>Debug Target: {target}ml</p>
      <p>Debug Fluid Left: {currentFluid}ml</p>
    </div>
  );
};

export default Bottle;
