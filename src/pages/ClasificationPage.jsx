// src/pages/ClasificationPage.jsx
import React from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import ClassificationBoard from "../components/classification/ClassificationBoard";

const ClasificationPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-24">
        <ClassificationBoard />
      </main>
    </div>
  );
};

export default ClasificationPage;
