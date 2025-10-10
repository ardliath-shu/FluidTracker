const FluidTargetForm = ({ currentTarget, setTarget, canSubmit }) => {
  return (
    <div>
      <div>
        <form onSubmit={(event) => canSubmit(false)}>
          <div className="row-sm">
            <div className="col flex-2">
              <div className="form-floating">
                <input
                  type="number"
                  name="fluid target"
                  id="fluid_target_input"
                  value={currentTarget}
                  step={50}
                  // onChange={handleTargetChange}
                  onChange={(event) => setTarget(parseInt(event.target.value))}
                />
                <label htmlFor="fluid_target_input">Fluid Target: </label>
              </div>
            </div>
            <div className="">
              <input type="submit" value="Set" className="btn blue" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FluidTargetForm;
