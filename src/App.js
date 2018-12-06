import React, { Component } from 'react';
import NavigateBar from './components/navigate/navigation-bar';
import MainPage from './components/navigate/main-display'
import './App.css';


const App = () => {
  return (
    <div className="App">
      <NavigateBar />
      <MainPage />
    </div>
  );
};
export default App;
