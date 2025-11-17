"use client";

import { useState } from "react";
import { siteConfig } from "@/app/lib/site.config";
import Bottle from "@/app/components/bottle/Bottle";
import FluidTargetForm from "@/app/components/card/FluidTargetCard";

const BottlePage = () => {
  const defaultFluidTarget = 2500; // ml
  const [fluidTarget, setFluidTarget] = useState(defaultFluidTarget);
  const [fluidLeft, setFluidLeft] = useState(defaultFluidTarget);
  const [allowTargetChange, setAllowTargetChange] = useState(true);

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
    <main>
      <div>
        <h1>{siteConfig.name}</h1>
      </div>
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
    </main>
  );
};

export default BottlePage;
