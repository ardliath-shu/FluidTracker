import Link from "next/link";

// Meta Data
export const metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <div className="card blue center">
      <h1>Login</h1>
      <hr />
      <p>Please enter your details to log in.</p>
      <form className="form" action="./">
        <div className="form-floating">
          <input type="text" id="username" placeholder="Username" required />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn">
          Log In
        </button>
      </form>
      <hr />
      <p>
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
