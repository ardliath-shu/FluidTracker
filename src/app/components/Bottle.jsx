import Image from "next/image";
import BottleWaterLevel from "./BottleWaterLevel";
import "../../../public/css/bottle.css";
import bottleImage from "../../../public/images/bottle.svg";

const Bottle = ({ target, currentFluid }) => {
  if (currentFluid < 0) {
    currentFluid = 0;
  }
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
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default Bottle;
