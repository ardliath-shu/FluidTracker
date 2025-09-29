import { useState } from "react";
import "../../../public/css/bottle.css";
import BottleWaterLevel from "./BottleWaterLevel";

const Bottle = ({ target, currentFluid, changeFluidAmount }) => {
  return (
    <div>
      <div className="bottlecontainer">
        <div id="bottle">
          <BottleWaterLevel levelPercent={(currentFluid / target) * 100} />
        </div>

        {/* Proof of concept water level controls */}
        {/* The final controls will behave a lot differently to this ^^' */}
        <button className="fluidbutton" onClick={() => changeFluidAmount(+50)}>
          Add 50ml
        </button>
        <button className="fluidbutton" onClick={() => changeFluidAmount(-50)}>
          Remove 50ml
        </button>
      </div>
      <p>Debug Target: {target}ml</p>
      <p>Debug Fluid Left: {currentFluid}ml</p>
    </div>
  );
};

export default Bottle;
