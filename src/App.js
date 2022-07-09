import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import NavMenu from './components/navmenu';
import Footer from './components/footer/footer';
import About from './components/about/about';
import Events from './components/events/events';
import Resources from './components/resources/resources';

function App() {
  return (
    <BrowserRouter className="App">
      <NavMenu />
      <Routes>
        <Route path="/" element={<Resources />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    );
}

export default App;
