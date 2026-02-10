import React from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import Scoreboard from "../components/Scoreboard";
import useScoreboard from "../hooks/useScoreboard";

const ScoreboardPage = () => {
  const { scoreboard, loading, error, refresh } = useScoreboard();
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-20 pb-20 flex flex-col overflow-hidden">
        <div className="max-w-2xl w-full mx-auto px-4 flex flex-col overflow-hidden min-h-0 flex-1">
          <Scoreboard
            data={scoreboard}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default ScoreboardPage;