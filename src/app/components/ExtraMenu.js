import { useTransition } from "react";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import {
  finishOpenDrinkAction,
  removeOpenDrinkAction,
} from "@/app/actions/patients";

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

  async function handleRemoveDrink(fluidEntryId) {
    if (!confirm("Are you sure you want to remove this drink?")) return;

    try {
      startTransition(async () => {
        const updatedPatient = await removeOpenDrinkAction(
          fluidEntryId,
          patient.patientId,
        );
        onPatientChange(updatedPatient.patientId);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove drink.");
    }
  }

  // Get a count of finished drinks today
  const finishedDrinksCount = patient.drinksToday.filter(
    (drink) => drink.timeEnded !== null,
  ).length;

  return (
    <aside className="extra">
      {/* Add Drink Form */}
      <AddDrinkForm
        isOpen={patient.openDrinks.length === 0} // Open if no drinks open
        patient={patient}
        userId={userId}
        onPatientUpdated={() => onPatientChange(patient.patientId)}
      />

      {/* Open Drinks List */}
      <Card
        title={
          patient.openDrinks.length > 0
            ? "" +
              patient.openDrinks.length +
              " Open Drink" +
              (patient.openDrinks.length > 1 ? "s" : "")
            : "No Open Drinks"
        }
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
                <span
                  className="remove-link"
                  onClick={() => handleRemoveDrink(drink.fluidEntryId)}
                  title="Remove Drink"
                >
                  Remove Drink
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Finished Drinks List */}
      <Card
        title={
          finishedDrinksCount > 0
            ? "" +
              finishedDrinksCount +
              " Finished Drink" +
              (finishedDrinksCount > 1 ? "s" : "")
            : "No Finished Drinks"
        }
        icon="fa-check"
        colour="green"
        collapsible={true}
        defaultOpen={finishedDrinksCount > 0}
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
            .length === 0 && <li className="center">No finished drinks</li>}
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

      {/* Fluid Target Form */}
      <FluidTargetForm
        currentTarget={patient.fluidTarget}
        patientId={patient.patientId}
        onUpdated={() => onPatientChange(patient.patientId)}
      />

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
