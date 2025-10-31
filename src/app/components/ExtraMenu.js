import { useTransition } from "react";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import { finishOpenDrinkAction } from "@/app/actions/patients";
import AddDrinkForm from "./AddDrink";
import Card from "./Card";
import FluidTargetForm from "./FluidTargetForm";

export default function ExtraMenu({ userId, patient, onPatientChange }) {
  const [isPending, startTransition] = useTransition();

  const handleFinishDrink = (drinkId) => {
    startTransition(async () => {
      const updatedPatient = await finishOpenDrinkAction(
        drinkId,
        patient.patientId,
      );
      // refresh the current patient data in the parent DashboardClient
      onPatientChange?.(updatedPatient.patientId);
    });
  };

  //Time now
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <aside className="extra">
      {/* Open Drinks List */}
      <Card
        title="Open Drinks"
        icon="fa-glass-water"
        colour="blue"
        collapsible={true}
        defaultOpen={patient.openDrinks.length > 0}
      >
        <ul className="open-drinks">
          {patient.openDrinks.length === 0 && (
            <li className="open-drink-item center">No open drinks</li>
          )}
          {patient.openDrinks.map((drink) => (
            <li key={drink.fluidEntryId} className="open-drink-item">
              <button
                className="finish-btn btn green"
                onClick={() => handleFinishDrink(drink.fluidEntryId)}
                disabled={isPending}
                title="Mark Drink as Finished"
              >
                {isPending ? "..." : <i className="fa-solid fa-check"></i>}
              </button>
              <div>
                {drink.note} ({drink.millilitres}ml)
                <br />
                <span>
                  Started at {formatMinutesSinceMidnight(drink.timeStarted)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Add Drink Form */}
      <AddDrinkForm
        patient={patient}
        userId={userId}
        onPatientUpdated={() => onPatientChange(patient.patientId)}
      />

      {/* Fluid Target Form */}
      <FluidTargetForm
        currentTarget={patient.fluidTarget}
        patientId={patient.patientId}
        onUpdated={() => onPatientChange(patient.patientId)}
      />

      {/* Finished Drinks List */}
      <Card
        title="Finished Drinks"
        icon="fa-check"
        colour="green"
        collapsible={true}
        defaultOpen={false}
      >
        <ul className="finished-drinks">
          {patient.drinksToday
            .filter((drink) => drink.timeEnded !== null) // only finished drinks
            .map((drink) => (
              <li key={drink.fluidEntryId}>
                {drink.note} ({drink.millilitres}ml)
                <br />
                <span>
                  Finished at {formatMinutesSinceMidnight(drink.timeEnded)}
                </span>
              </li>
            ))}
          {/* if no finished drinks */}
          {patient.drinksToday.filter((drink) => drink.timeEnded !== null)
            .length === 0 && <li>No finished drinks</li>}
        </ul>
      </Card>

      {/* Stats and Daily Trends */}
      <Card
        title="Stats and Daily Trend"
        icon="fa-percent"
        colour="orange"
        collapsible={true}
        defaultOpen={false}
      >
        <p>
          {Number(patient.userId) === Number(userId)
            ? "You have"
            : patient.firstName + " has"}{" "}
          consumed {Math.round(patient.totalToday)}ml so far today of the{" "}
          {patient.fluidTarget}ml target. By this time of day{" "}
          {Number(patient.userId) === Number(userId)
            ? "you have"
            : patient.firstName + " has"}{" "}
          typically consumed {Math.round(patient.typicalProgress[0].average)}ml
          however {Number(patient.userId) === Number(userId) ? "you" : "they"}{" "}
          may have consumed as little as{" "}
          {Math.round(patient.typicalProgress[0].min)}ml or as much as{" "}
          {Math.round(patient.typicalProgress[0].max)}ml.
        </p>
      </Card>

      {/* <Card
        title={`About ${siteConfig.name}`}
        icon="fas fa-fw fa-droplet"
        colour="green"
      >
        <p>
          {siteConfig.name} is {siteConfig.description.toLowerCase()}.
        </p>
      </Card> */}
    </aside>
  );
}
