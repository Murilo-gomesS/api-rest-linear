import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { ListPage } from "../pages/ListPage";
import { QueuePage } from "../pages/QueuePage";
import { StackPage } from "../pages/StackPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/pilha" replace />} />
        <Route path="/pilha" element={<StackPage />} />
        <Route path="/fila" element={<QueuePage />} />
        <Route path="/lista" element={<ListPage />} />
      </Route>
    </Routes>
  );
}