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
          <Image
            id="bottleimage"
            src={bottleImage}
            alt="A water bottle."
            priority
          />
        </div>

        {/* Proof of concept water level controls */}
        {/* The final controls will behave a lot differently to this ^^' */}
        {/* <div className="row">
          <div className="col center">
            <button
              className="btn green w-100"
              onClick={() => changeFluidAmount(+100)}
            >
              Add 50ml
            </button>
          </div>
          <div className="col center">
            <button
              className="btn red w-100"
              onClick={() => changeFluidAmount(-100)}
            >
              Remove 50ml
            </button>
          </div>
        </div> */}
      </div>
      {/* <p>Debug Target: {target}ml</p>
      <p>Debug Fluid Left: {currentFluid}ml</p> */}
      <hr />
    </div>
  );
};

export default Bottle;
