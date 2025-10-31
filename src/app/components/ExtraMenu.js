import { useTransition } from "react";
import { formatMinutesSinceMidnight } from "@/app/lib/utils";
import { finishOpenDrinkAction } from "@/app/actions/patients";
import Card from "./Card";

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

  return (
    <aside className="extra">
      <Card
        title="Stats and Daily Trend"
        icon="fa-percent"
        colour="orange"
        collapsible={true}
        defaultOpen={true}
      >
        <ul className="stats-list">
          <li className="stat-box">
            <span className="stat-value">{patient.fluidTarget}ml</span>
            <span className="stat-label">Target</span>
          </li>
          <li className="stat-box">
            <span className="stat-value">
              {Math.round((patient.totalToday / patient.fluidTarget) * 100)}%
            </span>
            <span className="stat-label">Complete</span>
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
        <p>
          {Number(patient.userId) === Number(userId)
            ? "You have"
            : patient.firstName + " has"}{" "}
          drunk {Math.round(patient.totalToday)}ml so far today of the{" "}
          {patient.fluidTarget}ml target. By this time of day{" "}
          {Number(patient.userId) === Number(userId)
            ? "you have"
            : patient.firstName + " has"}{" "}
          typically drunk {Math.round(patient.typicalProgress[0].average)}ml
          however {Number(patient.userId) === Number(userId) ? "you" : "they"}{" "}
          may have drunk as little as{" "}
          {Math.round(patient.typicalProgress[0].min)}ml or as much as{" "}
          {Math.round(patient.typicalProgress[0].max)}ml.
        </p>
      </Card>
      <Card
        title="Open Drinks"
        icon="fa-droplet"
        colour="purple"
        collapsible={true}
        defaultOpen={true}
      >
        <ul className="open-drinks">
          {patient.openDrinks.length === 0 && (
            <li className="open-drink-item">No open drinks</li>
          )}
          {patient.openDrinks.map((drink) => (
            <li key={drink.fluidEntryId} className="open-drink-item">
              <button
                className="finish-btn btn"
                onClick={() => handleFinishDrink(drink.fluidEntryId)}
                disabled={isPending}
                title="Mark Drink as Finished"
              >
                {isPending ? (
                  "..."
                ) : (
                  <i className="fa-solid fa-check white"></i>
                )}
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
      <Card
        title="Finished Drinks"
        icon="fa-check"
        colour="green"
        collapsible={true}
        defaultOpen={true}
      >
        <div className="rowX">
          <div className="col">
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
          </div>
        </div>
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
