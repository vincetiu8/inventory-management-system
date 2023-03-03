import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Container } from "@mui/joy";
import ItemsPage from "./Items/ItemsPage";
import LoginPage from "./Auth/LoginPage";
import {
  AdminRoutesWrapper,
  DynamicRedirect,
  ProtectedRoutesWrapper,
  UnauthedRoutesWrapper,
} from "./Auth/AuthRoutes";
import EmployeesPage from "./Employees/EmployeesPage";
import { IAuth } from "./Auth/IAuth";
import Navbar from "./Assets/Navbar";
import TransactionsPage from "./Transactions/TransactionsPage";

/**
 * The main component of the app. Handles routing URLs to the relevant pages.
 */
function App() {
  const [auth, setAuth] = React.useState<IAuth>({
    token: "",
    isAdmin: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");
    setAuth({ token: token || "", isAdmin: isAdmin === "true" });
  }, []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      className="App"
      sx={{
        minHeight: "100vh",
      }}
    >
      <BrowserRouter>
        {auth.token && <Navbar isAdmin={auth.isAdmin} setAuth={setAuth} />}
        <Routes>
          <Route
            path="/"
            element={
              <DynamicRedirect
                token={auth.token}
                isAdmin={auth.isAdmin}
                authPath="/items"
                unAuthPath="/login"
              />
            }
          />
          <Route element={<UnauthedRoutesWrapper token={auth.token} />}>
            <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
          </Route>
          <Route element={<ProtectedRoutesWrapper token={auth.token} />}>
            <Route path="/items" element={<ItemsPage token={auth.token} />} />
          </Route>
          <Route element={<ProtectedRoutesWrapper token={auth.token} />}>
            <Route
              path="/txs"
              element={<TransactionsPage token={auth.token} />}
            />
          </Route>
          <Route element={<AdminRoutesWrapper isAdmin={auth.isAdmin} />}>
            <Route
              path="/employees"
              element={<EmployeesPage token={auth.token} />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
