// Meta Data
export const metadata = {
	title: 'Log In',
};

export default function LoginPage() {
	return (
		<div className="card blue center">
			<h1>Login</h1>
			<hr />
			<p>Please enter your details to log in.</p>
			<form className="form">
				<div className="form-floating">
					<input type="email" id="email" placeholder="Email" required />
					<label htmlFor="email">Email</label>
				</div>
				<div className="form-floating">
					<input type="password" id="password" placeholder="Password" required />
					<label htmlFor="password">Password</label>
				</div>
				<button type="submit" className="btn">Log In</button>
			</form>
			<hr />
			<p>Don't have an account? <a href="/register">Register</a></p>
		</div>
	);
}