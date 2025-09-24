const FluidTargetForm = ({ currentTarget, setTarget, canSubmit }) => {
  const handleTargetChange = (event) => {
    console.log("handleTargetChange")
    const newTarget = event.target.value
    console.log(newTarget)
    setTarget(newTarget)
  }

  return (
    <div>
      <div>
        <form
          onSubmit={(event) => canSubmit(false)}
        >
          <div>
            <label htmlFor="q">Fluid Target: </label>
            <input
              type="number"
              name="fluid target"
              id="fluid target input"
              value={currentTarget}
              onChange={handleTargetChange}
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
