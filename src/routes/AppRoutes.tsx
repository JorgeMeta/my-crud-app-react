import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserListPage } from "../features/users";
import { UserFormPage } from "../features/users";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*CRUD de usuários*/}
        <Route path="/" element={<UserListPage />} />
        <Route path="/users/new" element={<UserFormPage />} />
        <Route path="/users/:id/edit" element={<UserFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
