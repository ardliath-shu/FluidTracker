export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
	  <h1><i className="fa fa-droplet"></i> Fluid Tracker</h1>
      <main>{children}</main>
    </div>
  );
}