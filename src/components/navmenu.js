import { signOut } from 'firebase/auth';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function NavMenu(props) {
  const { loggedIn, setLoggedIn } = props;
  const navigate = useNavigate();

  const logOutAdmin = () => {
    signOut(auth);
    // setLoggedIn(false);
    sessionStorage.removeItem('Auth Token');
    navigate("/");
  };

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
            {(sessionStorage.getItem('Auth Token')) ? (
              <NavDropdown title='Admin' id='admin-dropdown'>
                <NavDropdown.Item eventKey='4' as={Link} to="/admin">Dashboard</NavDropdown.Item>
                <NavDropdown.Item  className='link-danger' eventKey='5' onClick={() => logOutAdmin()}>Log Out</NavDropdown.Item>
              </NavDropdown>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
