import { siteConfig } from "@/app/lib/site.config";
import DarkModeToggle from "../components/DarkModeToggle";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <h1>
        <i className="fa fa-droplet"></i> {siteConfig.name}
      </h1>
      <main>{children}</main>
    </div>
  );
}
