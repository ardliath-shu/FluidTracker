"use client";

import { useRef } from "react";
import Card from "@/app/components/Card";

export default function PatientSelect({
  patients,
  currentPatient,
  userId,
  onSelectPatient,
}) {
  const cardRef = useRef(null);

  const handleClick = (patientId) => {
    onSelectPatient(patientId); // notify parent
    cardRef.current?.collapse(); // collapse card after selection
  };

  return (
    <Card
      ref={cardRef}
      title={
        Number(currentPatient.userId) === Number(userId)
          ? "Your Log"
          : `${currentPatient.firstName} ${currentPatient.lastName}'s Log`
      }
      icon="fa-user"
      colour="blue"
      collapsible
      defaultOpen={false}
      dropdown={true}
    >
      <ul className="patient-list">
        {patients.map((p) => (
          <li
            key={p.patientId}
            className={`patient-item ${
              Number(currentPatient.userId) === Number(p.userId)
                ? "selected"
                : ""
            }`}
            onClick={() => handleClick(p.patientId)}
          >
            <span className="patient-name">
              <i className="fa fa-fw fa-user"></i> {p.firstName} {p.lastName}
            </span>{" "}
            {p.userId == userId && <span className="you-label">(You)</span>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
