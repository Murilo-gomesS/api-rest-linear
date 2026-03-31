import { Outlet } from "react-router-dom";
import { MenuBar } from "./MenuBar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <MenuBar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}