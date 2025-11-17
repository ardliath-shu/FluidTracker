"use client";

import { useState, useTransition, useEffect } from "react";
import { getPatientData } from "@/app/actions/patients";
import Bottle from "@/app/components/bottle/Bottle";
import ExtraMenu from "@/app/components/ExtraMenu";
import PatientSelect from "@/app/components/card/PatientSelectCard";

export default function DashboardClient({
  userId,
  patient,
  patients,
  isCarer,
}) {
  // Set target to default or patient's existing target
  let defaultFluidTarget = 2500; // ml
  
  if (patient.fluidTarget) {
    defaultFluidTarget = patient.fluidTarget;
  }

  const [currentPatient, setCurrentPatient] = useState(patient);
  const [fluidTarget, setFluidTarget] = useState(defaultFluidTarget);
  const [fluidLeft, setFluidLeft] = useState(fluidTarget - patient.totalToday);
  const [isPending, startTransition] = useTransition();

  const [selectedPatientId, setSelectedPatientId] = useState(patient.patientId);

  useEffect(() => {
    if (patient?.patientId !== selectedPatientId) {
      // TODO: potential infinite loop here if there's bad data in the db
      setSelectedPatientId(patient.patientId);
    }
  }, [patient, selectedPatientId]);

  const handlePatientChange = (newPatientId) => {
    const id = Number(newPatientId);

    if (!Number.isFinite(id) || id <= 0 || isPending) return; // guard against accidental "refresh"/undefined

    startTransition(async () => {
      const newPatient = await getPatientData(id);
      setCurrentPatient(newPatient);
      setFluidTarget(newPatient.fluidTarget);
      setFluidLeft(newPatient.fluidTarget - newPatient.totalToday);
    });
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

  // Change colour from red, orange, yellow, green based on % reached
  let colourIndicator = "red";

  if (currentPatient.totalToday >= fluidTarget * 0.75) {
    colourIndicator = "green";
  } else if (currentPatient.totalToday >= fluidTarget * 0.5) {
    colourIndicator = "yellow";
  } else if (currentPatient.totalToday >= fluidTarget * 0.25) {
    colourIndicator = "orange";
  }

  return (
    <>
      <div fetchPriority="high">
        <section>
          <div className="row sticky-header-dashboard">
            {/* If user has multiple patients, show patient switcher */}
            {patients.length > 1 && (
              <div className="col">
                <PatientSelect
                  patients={patients}
                  currentPatient={currentPatient}
                  userId={userId}
                  onSelectPatient={handlePatientChange} // already handles patient change in parent
                />
              </div>
            )}

            <div className="stats-list-dashboard col important">
              <ul className="stats-list">
                <li className={`stat-box ${colourIndicator}`}>
                  <span className="stat-value">
                    {currentPatient.fluidTarget}ml
                  </span>
                  <span className="stat-label">Target</span>
                </li>
                <li className={`stat-box ${colourIndicator}`}>
                  <span className="stat-value">
                    {Math.round(
                      (currentPatient.totalToday / currentPatient.fluidTarget) *
                        100,
                    )}
                    %
                  </span>
                  <span className="stat-label">Complete</span>
                </li>

                {currentPatient.totalToday <= currentPatient.fluidTarget ? (
                  <li className={`stat-box ${colourIndicator}`}>
                    <span className="stat-value">
                      {currentPatient.fluidTarget - currentPatient.totalToday}ml
                    </span>
                    <span className="stat-label">Remaining</span>
                  </li>
                ) : (
                  <li className="stat-box orange">
                    <span className="stat-value">
                      {Math.abs(
                        currentPatient.fluidTarget - currentPatient.totalToday,
                      )}
                      ml
                    </span>
                    <span className="stat-label">Over Target</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <hr />

          {/* Fluid Bottle Visualisation */}
          <Bottle
            target={fluidTarget}
            currentFluid={fluidLeft}
            changeFluidAmount={handleSetFluidLeft}
          />
        </section>
      </div>

      {/* Secondary Panel With Extra Cards and Options */}
      <ExtraMenu
        userId={userId}
        patient={currentPatient}
        onPatientChange={handlePatientChange}
        isCarer={isCarer}
      />
    </>
  );
}
