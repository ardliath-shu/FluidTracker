import Link from "next/link";

// Meta Data
export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="card blue center">
      <h1>Register</h1>
      <hr />
      <p>Please fill in your details to create an account.</p>
      <form className="form">
        <div className="form-floating">
          <input type="text" id="Username" placeholder="Username" required />
          <label htmlFor="name">Username</label>
        </div>
        <div className="form-floating">
          <input type="text" id="name" placeholder="Full Name" required />
          <label htmlFor="name">Full Name</label>
        </div>
        <div className="form-floating">
          <input type="email" id="email" placeholder="Email" required />
          <label htmlFor="email">Email</label>
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
        <div className="form-floating">
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>
        <button type="submit" className="btn blue">
          Register
        </button>
      </form>
      <hr />
      <p>
        Already have an account? <Link href="/login">Log In</Link>
      </p>
    </div>
  );
}
