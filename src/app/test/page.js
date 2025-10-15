import { fetchUser, getMyPatientCurrentFluidTarget, setNewPatientFluidTarget, logNewDrink, getOpenDrinks, getDrinksForDate, finishOpenDrink, getTypicalProgresss } from "../lib/db";

const TestPage = async () => {
  const result = await fetchUser(1);
  const user = result[0];

  const fluidTarget = await getMyPatientCurrentFluidTarget(1, 1);
  console.log("initial read " + fluidTarget[0].millilitres);

  // await setNewPatientFluidTarget(1, 1, 2600, '2025-12-01 00:00:00');
  // const newFluidTarget = await getMyPatientCurrentFluidTarget(1, 1);
  // console.log("after update " + newFluidTarget[0].millilitres);


  const now = new Date();
  const hours = now.getHours();    // 0–23
  const minutes = now.getMinutes(); // 0–59
  const minutesSinceMidnight = hours * 60 + minutes;
  const day = now.toISOString().split('T')[0];

// await logNewDrink(1, 1, 200, day, minutesSinceMidnight, minutesSinceMidnight + 30, 'Programatically added drink');

const openDrinks = await getOpenDrinks(1, 1);
console.log(openDrinks);

const drinksToday = await getDrinksForDate(1, 1, day);
console.log(drinksToday);

// await finishOpenDrink(1100, 1, 1, 2);

const typicalProgress = await getTypicalProgresss(1, 1, '2025-01-01', minutesSinceMidnight);
console.log(typicalProgress);

  return (
    <main>
      <div>
        <h1>Hello {user.email}</h1>  
        <p>Your fluid target is {fluidTarget[0].millilitres}</p>

        <p>By this time of day you will typically have drunk {typicalProgress[0].average} however you may have drunk as little as {typicalProgress[0].min} or as much as {typicalProgress[0].max}.</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Started</th>
            <th>Finished</th>
            <th>Millilitres</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>          
          {drinksToday.map((drink, fluidEntryId) => (
            <tr key={fluidEntryId}>
              <td>{drink.date.toLocaleString()}</td>
              <td>{drink.timeStarted}</td>
              <td>{drink.timeEnded}</td>
              <td>{drink.millilitres}</td>
              <td>
                {drink.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </main>
  );
};

export default TestPage;
