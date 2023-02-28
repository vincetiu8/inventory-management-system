import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Container } from "@mui/joy";
import ResultsPage from "./ResultsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ResultsPage />,
  },
]);

function App() {
  return (
    <Container maxWidth={false} className="App">
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
