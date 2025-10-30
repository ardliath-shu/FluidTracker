import { siteConfig } from "@/app/lib/site.config";
import Card from "./Card";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import { useState, useEffect } from "react";

export default function ExtraMenu({
  username,
  patient,
  patients,
  onPatientChange,
}) {
  // const [selectedPatientId, setSelectedPatientId] = useState(patient.patientId);

  // useEffect(() => {
  //   if (patient?.patientId && patient.patientId !== selectedPatientId) {
  //     setSelectedPatientId(patient.patientId);
  //   }
  // }, [patient]);

  // function handleSelect(e) {
  //   const newId = Number(e.target.value);
  //   setSelectedPatientId(newId);
  //   onPatientChange?.(newId);
  // }

  return (
    <aside className="extra">
      {/* {patients.length > 0 && (
      <Card title="People You Manage" icon="fas fa-fw fa-users" colour="blue">
        <select value={selectedPatientId} onChange={handleSelect}>
          {patients.map((p) => (
            <option key={p.patientId} value={p.patientId}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </Card>
      )} */}
      <Card title="Statistics" icon="fas fa-fw fa-percent" colour="orange">
        <ul className="stats-list">
          <li className="stat-box">
            <span className="stat-value">{patient.fluidTarget}ml</span>
            <span className="stat-label">Target</span>
          </li>
          <li className="stat-box">
            <span className="stat-value">
              {Math.round((patient.totalToday / patient.fluidTarget) * 100)}%
            </span>
            <span className="stat-label">Drunk</span>
          </li>
          {/* <li className="stat-box">
            <span className="stat-value">{Math.round(patient.totalToday)}ml</span>
            <span className="stat-label">Drunk</span>
          </li> */}
          <li className="stat-box">
            <span className="stat-value">
              {patient.fluidTarget - patient.totalToday}ml
            </span>
            <span className="stat-label">Remaining</span>
          </li>
        </ul>
      </Card>
      <Card title="Daily Trend" icon="fas fa-fw fa-chart-line" colour="red">
        <p>
          By this time of day {patient.firstName} will typically have drunk{" "}
          {Math.round(patient.typicalProgress[0].average)}ml however they may
          have drunk as little as {Math.round(patient.typicalProgress[0].min)}ml
          or as much as {Math.round(patient.typicalProgress[0].max)}ml.
        </p>
      </Card>
      <Card title="Open Drinks" icon="fas fa-fw fa-droplet" colour="purple">
        <ul>
          {patient.openDrinks.map((drink) => (
            <li key={drink.fluidEntryId}>
              {drink.note} ({drink.millilitres}ml)
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Finished Drinks" icon="fas fa-fw fa-check" colour="green">
        <div className="rowX">
          <div className="col">
            <ul>
              {patient.drinksToday
                .filter((drink) => drink.timeEnded !== null) // only finished drinks
                .map((drink) => (
                  <li key={drink.fluidEntryId}>
                    {drink.note} ({drink.millilitres}ml) - Finished at{" "}
                    {formatMinutesSinceMidnight(drink.timeEnded)}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Card>
      <Card
        title={`About ${siteConfig.name}`}
        icon="fas fa-fw fa-droplet"
        colour="green"
      >
        <p>
          {siteConfig.name} is {siteConfig.description.toLowerCase()}.
        </p>
      </Card>
    </aside>
  );
}
