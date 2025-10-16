import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="card blue center">
      <h1>Register</h1>
      <hr />
      <p>Please fill in your details to create an account.</p>
      <RegisterForm />
      <hr />
      <p>
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
}
