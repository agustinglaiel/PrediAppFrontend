import React from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import Scoreboard from "../components/Scoreboard";
import useScoreboard from "../hooks/useScoreboard";

const ScoreboardPage = () => {
  const { scoreboard, loading, error, refresh } = useScoreboard();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 px-4">
        <Scoreboard
          data={scoreboard}
          loading={loading}
          error={error}
        />
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ScoreboardPage;
