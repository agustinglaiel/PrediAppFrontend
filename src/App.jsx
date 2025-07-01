// frontendnuevo/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProdeDispatcher from "./pages/ProdeDispatcher";
import PronosticosPage from "./pages/PronosticosPage";
import ProdeSessionResultPage from "./pages/ProdeSessionResultPage";
import ProdeRaceResultPage from "./pages/ProdeRaceResultPage";
import ResultsPage from "./pages/ResultsPage";
// import SessionResult from "./pages/SessionResults";
// import AdminSessionResults from "./pages/AdminSessionResults";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersManagementPage from "./pages/AdminUsersManagementPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSessionManagementPage from "./pages/AdminSessionManagementPage";
import AdminResultsManagementPage from "./pages/AdminResultsManagementPage";
import SessionResultPage from "./pages/SessionResultPage";
import AdminDriverManagementPage from "./pages/AdminDriverManagementPage";
import SignUpPage from "./pages/SignUpPage";
import AdminProdesManagementPage from "./pages/AdminProdesManagementPage";
import GroupsPage from "./pages/GroupsPage";
import ForoPage from "./pages/ForoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/pronosticos" element={<PronosticosPage />} />
        <Route path="/pronosticos/:session_id" element={<ProdeDispatcher />} />
        <Route path="/foro" element={<ForoPage />} />
        <Route path="/grupos" element={<GroupsPage />} />
        <Route
          path="/pronosticos/result/:session_id"
          element={<ProdeSessionResultPage />}
        />
        <Route
          path="/pronosticos/result/race/:session_id"
          element={<ProdeRaceResultPage />}
        />
        <Route path="/resultados" element={<ResultsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsersManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute>
              <AdminSessionManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/results"
          element={
            <ProtectedRoute>
              <AdminResultsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers" // Nueva ruta
          element={
            <ProtectedRoute>
              <AdminDriverManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/prodes" // Nueva ruta
          element={
            <ProtectedRoute>
              <AdminProdesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="/resultados/:sessionId" element={<SessionResultPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
