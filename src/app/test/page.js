import { fetchUser, getMyPatientCurrentFluidTarget, setNewPatientFluidTarget } from "../lib/db";

const TestPage = async () => {
  const result = await fetchUser(1);
  const user = result[0];

  const fluidTarget = await getMyPatientCurrentFluidTarget(1, 1);
  console.log("initial read " + fluidTarget[0].millilitres);

  await setNewPatientFluidTarget(1, 1, 2600, '2025-12-01 00:00:00');
  const newFluidTarget = await getMyPatientCurrentFluidTarget(1, 1);
  console.log("after update " + newFluidTarget[0].millilitres);


console.log(user);
  return (
    <main>
      <div>
        <h1>Hello {user.email}</h1>  
        <p>Your fluid target was {fluidTarget[0].millilitres} it has been updated to {newFluidTarget[0].millilitres} ml</p>
      </div>      
    </main>
  );
};

export default TestPage;
