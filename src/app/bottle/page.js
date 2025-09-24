"use client";
import { useState } from "react";

import FluidBottle from "@/app/components/FluidBottle";
import FluidTargetForm from "@/app/components/FluidTargetForm";

const BottlePage = () => {
  const defaultFluidTarget = 2500;
  const [fluidTarget, setFluidTarget] = useState(0);
  const [allowTargetChange, setAllowTargetChange] = useState(true);

  // TODO: get fluidTarget from db.

  return (
    <main>
      <div>
        <h2>Fluid Tracker</h2>
      </div>
      <section>
        {allowTargetChange && (
          <FluidTargetForm
            currentTarget={fluidTarget ? fluidTarget : defaultFluidTarget}
            setTarget={setFluidTarget}
            canSubmit={setAllowTargetChange}
          />
        )}
        <FluidBottle ft={fluidTarget} />
      </section>
    </main>
  );
};

export default BottlePage;
