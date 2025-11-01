"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { updatePatientFluidTarget } from "@/app/actions/patients";
import Card from "@/app/components/Card";

const FluidTargetForm = ({ currentTarget, patientId, onUpdated }) => {
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState(currentTarget);
  const cardRef = useRef(null);

  useEffect(() => {
    setTarget(currentTarget);
  }, [currentTarget]);

  async function handleSubmit(event) {
    event.preventDefault();
    startTransition(async () => {
      const updatedPatient = await updatePatientFluidTarget(patientId, target);
      onUpdated?.(updatedPatient); // Update parent component
      cardRef.current?.collapse(); // collapse card after update
    });
  }

  return (
    <Card
      ref={cardRef} // Card ref to control collapse after submission
      title="Set Fluid Target"
      icon="fa-tint"
      colour="blue"
      collapsible={true}
      defaultOpen={false}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row-sm">
            <div className="col flex-2">
              <div className="form-floating no-margin">
                <input
                  type="number"
                  name="fluid_target"
                  id="fluid_target_input"
                  value={target}
                  step={50}
                  min={0}
                  required
                  onChange={(event) => setTarget(event.target.value)}
                  disabled={isPending}
                />
                <label htmlFor="fluid_target_input">Fluid Target (ml):</label>
              </div>
            </div>
            <div className="">
              <input
                type="submit"
                value={isPending ? "Updating..." : "Set"}
                className="btn blue"
                disabled={isPending}
              />
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default FluidTargetForm;
