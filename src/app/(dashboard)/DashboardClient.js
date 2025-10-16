"use client";

import { useState } from "react";
import ExtraMenu from "@/app/components/ExtraMenu";
import Bottle from "@/app/components/Bottle";
import FluidTargetForm from "@/app/components/FluidTargetForm";

export default function DashboardClient() {
  const defaultFluidTarget = 2500; // ml
  const [fluidTarget, setFluidTarget] = useState(defaultFluidTarget);
  const [fluidLeft, setFluidLeft] = useState(defaultFluidTarget);
  const [allowTargetChange, setAllowTargetChange] = useState(true);

  // TODO: get fluidTarget from db.

  const handleSetAllowTargetChange = (state) => {
    setAllowTargetChange(state);
    setFluidLeft(fluidTarget);
  };

  const handleSetFluidTarget = (target) => {
    setFluidLeft(target);
    setFluidTarget(target);
  };

  const handleSetFluidLeft = (amount) => {
    const newFluidLeft = fluidLeft + amount;

    if (newFluidLeft > fluidTarget) {
      setFluidLeft(fluidTarget);
    } else if (newFluidLeft < 0) {
      setFluidLeft(0);
    } else {
      setFluidLeft(newFluidLeft);
    }
  };

  return (
    <>
      <div>
        <section>
          {allowTargetChange && (
            <FluidTargetForm
              currentTarget={fluidTarget ? fluidTarget : defaultFluidTarget}
              setTarget={handleSetFluidTarget}
              canSubmit={handleSetAllowTargetChange}
            />
          )}
          <Bottle
            target={fluidTarget}
            currentFluid={fluidLeft}
            changeFluidAmount={handleSetFluidLeft}
          />
        </section>
      </div>

      <ExtraMenu />
    </>
  );
}