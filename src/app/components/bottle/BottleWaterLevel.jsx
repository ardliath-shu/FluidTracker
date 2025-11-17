import Image from "next/image";
import wavyWaterLine from "../../../../public/images/wavy-water-line.svg";

import "../../../../public/css/water-animation.css";

const BottleWaterLevel = ({ levelPercent }) => {
  return (
    <div className="water">
      <div id="waterlevel" style={{ height: levelPercent + "%" }}>
        <Image
          id="wavywaterline"
          src={wavyWaterLine}
          alt="Wavy line showing the current fluid level."
          priority
        />
      </div>
    </div>
  );
};

export default BottleWaterLevel;
