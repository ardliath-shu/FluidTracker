import RegisterForm from "./RegisterForm";
import Link from "next/link";

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
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </div>
  );
}
