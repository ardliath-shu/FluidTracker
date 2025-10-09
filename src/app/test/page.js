import { fetchUser } from "../lib/db";

const TestPage = async () => {
  
  const result = await fetchUser(1);
    const user = result[0];
console.log(user);
  return (
    <main>
      <div>
        <h1>Hello {user.email}</h1>        
      </div>      
    </main>
  );
};

export default TestPage;
