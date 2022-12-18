import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./routing/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { AppStateProvider } from "./contexts/AppContext";
import "./index.css";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";

const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const App = React.lazy(() => import("./App"));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppStateProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />\
            <Route
              path="/"
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppStateProvider>
  </React.StrictMode>
);
