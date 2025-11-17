"use client";

import { useTransition } from "react";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import {
  finishOpenDrinkAction,
  removeDrinkAction,
} from "@/app/actions/patients";
import Card from "./Card";

export default function OpenDrinksList({
  patient,
  onPatientChange,
  confirm,
  showToast,
}) {
  const [isPending, startTransition] = useTransition();

  const handleFinishDrink = (drinkId) => {
    startTransition(async () => {
      const updatedPatient = await finishOpenDrinkAction(
        drinkId,
        patient.patientId,
      );
      onPatientChange?.(updatedPatient.patientId);
      showToast?.("Drink marked as finished", "success");
    });
  };

  async function handleRemoveDrink(fluidEntryId) {
    const ok = await confirm?.("Are you sure you want to remove this drink?");

    if (!ok) {
      return;
    }

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

  return (
    <>
      <Card
        title={
          patient.openDrinks.length > 0
            ? `${patient.openDrinks.length} Open Drink${patient.openDrinks.length > 1 ? "s" : ""}`
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
                className="finish-btn btn blue"
                onClick={() => handleFinishDrink(drink.fluidEntryId)}
                disabled={isPending}
                title="Mark Drink as Finished"
              >
                {isPending ? "..." : <i className="fa-solid fa-check"></i>}
              </button>
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
                  Started at {formatMinutesSinceMidnight(drink.timeStarted)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
