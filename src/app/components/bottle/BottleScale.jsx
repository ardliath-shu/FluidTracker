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
