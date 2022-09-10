import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import NavMenu from './components/navmenu';
import Footer from './components/footer/footer';
import About from './components/about/about';
import Events from './components/events/events';
import Resources from './components/resources/resources';
import './App.css';

function App() {
  return (
    <Container fluid className="App d-flex flex-column justify-content-between">
      <div>
        <NavMenu />
        <Routes>
          <Route path="/" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
      <Footer className='footer' />
    </Container>
    );
}

export default App;
