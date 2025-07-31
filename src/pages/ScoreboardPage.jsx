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
      <main className="flex-grow pt-20 px-4 pb-20 flex flex-col overflow-hidden">
        <Scoreboard
          data={scoreboard}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default ScoreboardPage;