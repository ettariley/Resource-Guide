import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavMenu() {
  return (
    <Navbar fixed="top" variant="dark" bg="secondary" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <img src={require('../assets/HRGlogo.png')} height="60" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Link className="nav-link" to="/">
              Resources
            </Link>
            <Link className="nav-link" to="/events">
              Events
            </Link>
            <Link className="nav-link" to="/about">
              About
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
