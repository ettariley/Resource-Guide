import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavMenu() {
  return (
    <Navbar collapseOnSelect fixed="top" variant="dark" bg="secondary" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <img src={require('../assets/HRGlogo.png')} height="60" alt='Hamblen Resource Guide Logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link eventKey='1' as={Link} to="/">
              Resources
            </Nav.Link>
            <Nav.Link eventKey='2' as={Link} to="/events">
              Events
            </Nav.Link>
            <Nav.Link eventKey='3' as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link eventKey='4' as={Link} to="/admin">
              Admin
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
