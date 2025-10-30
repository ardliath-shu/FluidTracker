import { siteConfig } from "@/app/lib/site.config";
import Card from "./Card";

export default function ExtraMenu({ username, patient, patients }) {
  return (
    <aside className="extra">
      <h2>
        {patient.firstName} {patient.lastName}&apos;s Log
      </h2>
      <hr />
      <Card title="Daily Trend" icon="fas fa-fw fa-chart-line" colour="red">
        <p>
          By this time of day {patient.firstName} will typically have drunk{" "}
          {Math.round(patient.typicalProgress[0].average)}ml however you may
          have drunk as little as {patient.typicalProgress[0].min}ml or as much
          as {patient.typicalProgress[0].max}ml.
        </p>
      </Card>
      <Card title="Statistics" icon="fas fa-fw fa-percent" colour="orange">
        <ul>
          <li>{patient.fluidTarget}ml daily target</li>
          <li>{patient.totalToday}ml Drunk today</li>
          <li> Remaining: {patient.fluidTarget - patient.totalToday}ml</li>
        </ul>
      </Card>
      {patient.openDrinks.length > 0 && (
        <Card title="Open Drinks" icon="fas fa-fw fa-droplet" colour="purple">
          <ul>
            {patient.openDrinks.map((drink) => (
              <li key={drink.fluidEntryId}>
                {drink.note} ({drink.millilitres}ml)
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card title="Finished Drinks" icon="fas fa-fw fa-check" colour="green">
        <div className="rowX">
          <div className="col">
            <ul>
              {patient.drinksToday
                .filter((drink) => drink.timeEnded !== null) // only finished drinks
                .map((drink) => (
                  <li key={drink.fluidEntryId}>
                    {drink.note} ({drink.millilitres}ml) - Finished at{" "}
                    {drink.timeEnded}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Card>
      {patients.length > 0 && (
        <Card
          title="People You Manage"
          icon="fas fa-fw fa-users"
          colour="yellow"
        >
          <ul>
            {patients.map((p) => (
              <li key={p.patientId}>{p.firstName}</li>
            ))}
          </ul>
        </Card>
      )}
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
