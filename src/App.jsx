// frontendnuevo/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProdeDispatcher from "./pages/ProdeDispatcher";
import ProdeSessionResultPage from "./pages/ProdeSessionResultPage";
import ProdeRaceResultPage from "./pages/ProdeRaceResultPage";
import ResultsPage from "./pages/ResultsPage";
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
import GroupPage from "./pages/GroupPage";
import MyProfilePage from "./pages/MyProfilePage";
import PostPage from "./pages/PostPage";
import ScoreboardPage from "./pages/ScoreboardPage";
import RankingPage from "./pages/RankingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/scoreboard/general" element={<ScoreboardPage />} />       
        <Route path="/pronosticos/:session_id" element={<ProdeDispatcher />} />
        <Route path="/foro" element={<ForoPage />} />
        <Route path="/grupos" element={<GroupsPage />} />
        <Route path="/grupos/:groupId" element={<GroupPage />} />
        <Route path="/profile/:userId" element={<MyProfilePage />} />
        <Route path="/foro/:postId" element={<PostPage />} />
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
