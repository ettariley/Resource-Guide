import React, { useState } from 'react';
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
import Admin from './components/admin/admin';
import Login from './components/login/login';

function App() {

  // Login state
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Container fluid className="App d-flex flex-column justify-content-between">
      <div>
        <NavMenu loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route path="/" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin loggedIn={loggedIn} />} />
          <Route path="/login" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        </Routes>
      </div>
      <Footer className='footer' />
    </Container>
    );
}

export default App;
