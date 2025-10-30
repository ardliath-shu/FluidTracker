"use client";

import { useState, useTransition, useEffect } from "react";
import ExtraMenu from "@/app/components/ExtraMenu";
import Bottle from "@/app/components/Bottle";
import FluidTargetForm from "@/app/components/FluidTargetForm";
import AddDrinkForm from "@/app/components/AddDrink";
import Card from "@/app/components/Card";
import { getPatientData } from "@/app/actions/patients";

export default function DashboardClient({
  userId,
  username,
  patient,
  patients,
}) {
  const defaultFluidTarget = patient.fluidTarget; // ml

  const [currentPatient, setCurrentPatient] = useState(patient);
  const [fluidTarget, setFluidTarget] = useState(defaultFluidTarget);
  const [fluidLeft, setFluidLeft] = useState(
    defaultFluidTarget - patient.totalToday,
  );
  const [allowTargetChange, setAllowTargetChange] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedPatientId, setSelectedPatientId] = useState(patient.patientId);

  useEffect(() => {
    if (patient?.patientId && patient.patientId !== selectedPatientId) {
      setSelectedPatientId(patient.patientId);
    }
  }, [patient]);

  function handleSelect(e) {
    const newId = Number(e.target.value);
    setSelectedPatientId(newId);
    handlePatientChange(newId);
  }

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

  const handlePatientChange = (newPatientId) => {
    startTransition(async () => {
      const newPatient = await getPatientData(newPatientId);
      setCurrentPatient(newPatient);
      setFluidTarget(newPatient.fluidTarget);
      setFluidLeft(newPatient.fluidTarget - newPatient.totalToday);
    });
  };

  return (
    <>
      <div>
        <section>
          {patients.length > 0 && (
            <Card title="" icon="" colour="">
              <select value={selectedPatientId} onChange={handleSelect}>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </Card>
          )}
          <Bottle
            target={fluidTarget}
            currentFluid={fluidLeft}
            changeFluidAmount={handleSetFluidLeft}
          />
          <AddDrinkForm
            patient={currentPatient}
            userId={userId}
            onPatientUpdated={(p) => {
              setCurrentPatient(p);
              setFluidTarget(p.fluidTarget);
              setFluidLeft(p.fluidTarget - p.totalToday);
            }}
          />
          {allowTargetChange && (
            <Card
              title="Set Fluid Target"
              icon="fas fa-fw fa-tint"
              colour="teal"
              collapsible={true}
              defaultOpen={false}
            >
              <FluidTargetForm
                currentTarget={fluidTarget ? fluidTarget : defaultFluidTarget}
                setTarget={handleSetFluidTarget}
                canSubmit={handleSetAllowTargetChange}
              />
            </Card>
          )}
        </section>
      </div>

      <ExtraMenu
        username={username}
        patient={currentPatient}
        patients={patients}
        onPatientChange={handlePatientChange}
      />
    </>
  );
}
