import Image from "next/image";
import wavyWaterLine from "../../../public/images/wavy-water-line.svg";

// TODO: add toggle for reduced animations
import "../../../public/css/water-animation.css";

const BottleScale = ({ target }) => {
  return (
    <div className="bottlescale">
      <div className="padding-top" />
      <div className="bottlewaterscale">
        <div className="scaletext">
          <span>{(target * 3) / 4}</span>
        </div>
        <div className="scaletext">
          <span>{target / 2}</span>
        </div>
        <div className="scaletext">
          <span>{target / 4}</span>
        </div>
      </div>
      <div className="padding-bottom" />
    </div>
  );
};

export default BottleScale;
