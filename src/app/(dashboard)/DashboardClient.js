"use client";

import { useState, useTransition, useEffect } from "react";
import { getPatientData } from "@/app/actions/patients";
import AddDrinkForm from "@/app/components/AddDrink";
import Bottle from "@/app/components/Bottle";
import Card from "@/app/components/Card";
import ExtraMenu from "@/app/components/ExtraMenu";
import FluidTargetForm from "@/app/components/FluidTargetForm";

export default function DashboardClient({
  userId,
  username,
  patient,
  patients,
}) {
  // Set target to default or patient's existing target
  let defaultFluidTarget = 2600; // ml
  if (patient.fluidTarget) {
    defaultFluidTarget = patient.fluidTarget;
  }

  const [currentPatient, setCurrentPatient] = useState(patient);
  const [fluidTarget, setFluidTarget] = useState(defaultFluidTarget);
  const [fluidLeft, setFluidLeft] = useState(fluidTarget - patient.totalToday);
  //const [allowTargetChange, setAllowTargetChange] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedPatientId, setSelectedPatientId] = useState(patient.patientId);

  useEffect(() => {
    if (patient?.patientId && patient.patientId !== selectedPatientId) {
      setSelectedPatientId(patient.patientId);
    }
  }, [patient]);

  // Handle patient selection change
  function handleSelectPatient(e) {
    const newId = Number(e.target.value);
    setSelectedPatientId(newId);
    handlePatientChange(newId);
  }

  const handlePatientChange = (newPatientId) => {
    startTransition(async () => {
      const newPatient = await getPatientData(newPatientId);
      setCurrentPatient(newPatient);
      setFluidTarget(newPatient.fluidTarget);
      setFluidLeft(newPatient.fluidTarget - newPatient.totalToday);
    });
  };

  // const handleSetAllowTargetChange = (state) => {
  //   setAllowTargetChange(state);
  //   setFluidLeft(fluidTarget);
  // };

  const handleSetFluidTarget = (target) => {
    setFluidTarget(target);
    setFluidLeft(target - (currentPatient.totalToday || 0));
  };

  const handleSetFluidLeft = (amount) => {
    const newFluidLeft = fluidLeft + amount;
    alert(newFluidLeft);
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
          {/* If user has multiple patients, show patient switcher */}
          {patients.length > 1 && (
            <Card
              title={
                Number(currentPatient["userId"]) === Number(userId)
                  ? "Your Log"
                  : currentPatient.firstName +
                    " " +
                    currentPatient.lastName +
                    "'s Log"
              }
              icon="fa-user"
              colour="blue"
              collapsible={true}
              defaultOpen={false}
            >
              <select value={selectedPatientId} onChange={handleSelectPatient}>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.firstName} {p.lastName}{" "}
                    {p.userId == userId ? "(You)" : ""}
                  </option>
                ))}
              </select>
            </Card>
          )}

          {/* Fluid Bottle Visualisation */}
          <Bottle
            target={fluidTarget}
            currentFluid={fluidLeft}
            changeFluidAmount={handleSetFluidLeft}
          />

          {/* Add Drink Form */}
          <AddDrinkForm
            patient={currentPatient}
            userId={userId}
            onPatientUpdated={(p) => {
              setCurrentPatient(p);
              setFluidTarget(p.fluidTarget);
              setFluidLeft(p.fluidTarget - p.totalToday);
            }}
          />

          {/* Fluid Target Form */}
          <FluidTargetForm
            currentTarget={fluidTarget ? fluidTarget : defaultFluidTarget}
            setTarget={handleSetFluidTarget}
            // canSubmit={handleSetAllowTargetChange}
            patientId={currentPatient.patientId}
            onUpdated={(updatedPatient) => {
              setCurrentPatient(updatedPatient);
              setFluidTarget(updatedPatient.fluidTarget);
              setFluidLeft(
                updatedPatient.fluidTarget - updatedPatient.totalToday,
              );
            }}
          />
        </section>
      </div>

      {/* Secondary Panel With Extra Cards and Options */}
      <ExtraMenu
        userId={userId}
        patient={currentPatient}
        onPatientChange={handlePatientChange}
      />
    </>
  );
}
