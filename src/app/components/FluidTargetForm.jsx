const FluidTargetForm = ({ currentTarget, setTarget, canSubmit }) => {
  return (
    <div>
      <div>
        <form onSubmit={(event) => canSubmit(false)}>
          <div>
            <label htmlFor="q">Fluid Target: </label>
            <input
              type="number"
              name="fluid target"
              id="fluid target input"
              value={currentTarget}
              step={50}
              // onChange={handleTargetChange}
              onChange={(event) => setTarget(parseInt(event.target.value))}
            />
          </div>
          <div>
            <input type="submit" value="Set Fluid Target" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FluidTargetForm;
