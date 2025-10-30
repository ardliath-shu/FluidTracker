"use client";

import { useTransition } from "react";
import { updatePatientFluidTarget } from "@/app/actions/patients";
import Card from "@/app/components/Card";

const FluidTargetForm = ({
  currentTarget,
  setTarget,
  // canSubmit,
  patientId,
  onUpdated,
}) => {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event) {
    event.preventDefault();
    startTransition(async () => {
      const updatedPatient = await updatePatientFluidTarget(
        patientId,
        currentTarget,
      );
      //canSubmit(false);
      onUpdated?.(updatedPatient);
    });
  }

  return (
    <Card
      title="Set Fluid Target"
      icon="fas fa-fw fa-tint"
      colour="teal"
      collapsible={true}
      defaultOpen={false}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <div className="row-sm">
            <div className="col flex-2">
              <div className="form-floating">
                <input
                  type="number"
                  name="fluid_target"
                  id="fluid_target_input"
                  value={currentTarget}
                  step={50}
                  onChange={(event) => setTarget(parseInt(event.target.value))}
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
