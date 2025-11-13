"use client";

import { useTransition } from "react";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import { removeDrinkAction } from "@/app/actions/patients";
import Card from "./Card";

export default function FinishedDrinksList({
  patient,
  onPatientChange,
  confirm,
  showToast,
}) {
  const [isPending, startTransition] = useTransition();

  async function handleRemoveDrink(fluidEntryId) {
    const ok = await confirm?.("Are you sure you want to remove this drink?");
    if (!ok) return;

    try {
      startTransition(async () => {
        const updatedPatient = await removeDrinkAction(
          fluidEntryId,
          patient.patientId,
        );
        onPatientChange(updatedPatient.patientId);
        showToast?.("Drink removed successfully", "success");
      });
    } catch (err) {
      console.error(err);
      showToast?.("Failed to remove drink.", "error");
    }
  }

  // Get a count of finished drinks today
  const finishedDrinksCount = patient.drinksToday.filter(
    (drink) => drink.timeEnded !== null,
  ).length;

  return (
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
              <button
                className="finish-btn btn red"
                onClick={() => handleRemoveDrink(drink.fluidEntryId)}
                disabled={isPending}
                title="Remove Drink"
              >
                {isPending ? "..." : <i className="fa-solid fa-times"></i>}
              </button>
              <div>
                {drink.note} ({drink.millilitres}ml)
                <br />
                <span>
                  Finished at {formatMinutesSinceMidnight(drink.timeEnded)}
                </span>
              </div>
            </li>
          ))}
        {/* if no finished drinks */}
        {patient.drinksToday.filter((drink) => drink.timeEnded !== null)
          .length === 0 && <li className="center">No finished drinks</li>}
      </ul>
    </Card>
  );
}
