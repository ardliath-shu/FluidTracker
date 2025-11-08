import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import Card from "./Card";

export default function FinishedDrinksList({ patient }) {
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
  );
}
