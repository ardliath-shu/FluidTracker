import LoginForm from "./LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <div className="card blue center">
      <h1>Login</h1>
      <hr />
      <p>Please enter your details to log in.</p>
      <LoginForm />
      <hr />
      <p>
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
