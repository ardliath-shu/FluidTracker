import LoginForm from "./LoginForm";

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
        Don&apos;t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
