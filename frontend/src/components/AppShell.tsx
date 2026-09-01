import {
  FilePlus,
  House,
  Lifebuoy,
  ListChecks,
  Wallet,
} from "@phosphor-icons/react";
import { NavLink, Outlet } from "react-router-dom";
import { WalletControls } from "../wallet/WalletControls";
import { NetworkStatus } from "./NetworkStatus";

const navigation = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/agreements/new", label: "New agreement", icon: FilePlus },
  { to: "/activity", label: "Activity", icon: ListChecks },
  { to: "/account", label: "Account", icon: Wallet },
  { to: "/help", label: "Help", icon: Lifebuoy },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="ScopeSeal Accord home">
          <img
            className="brand-mark"
            src="/scopeseal-logo.svg"
            alt=""
            aria-hidden="true"
            width="32"
            height="32"
          />
          <span>ScopeSeal Accord</span>
        </NavLink>
        <div className="header-actions">
          <nav className="primary-navigation" aria-label="Primary navigation">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}>
                <Icon size={19} weight="regular" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <WalletControls />
        </div>
      </header>
      <main id="main-content" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>Official evidence. Co-ratified terms. Canonical settlement.</span>
        <NetworkStatus />
      </footer>
    </div>
  );
}
