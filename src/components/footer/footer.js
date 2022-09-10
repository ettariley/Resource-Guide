import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { NavLink } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <Container fluid className='text-bg-dark bg-secondary'>
      <Row className='p-3 justify-content-around'>
        <Col sm md='3' className='m-1 me-2'>
          <h4>Hamblen Resource Guide</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </Col>
        <Col sm md='3' className='m-1'>
          <h4>Contact Us</h4>
          <Row>
            <a
              href="mailto:ettahaselden@gmail.com"
              title="Email"
              target="_blank"
            >
              ettahaselden@gmail.com
            </a>
          </Row>
          <Row>
            <a href="tel:423-438-7569" title="Call">
              423-438-7569
            </a>
          </Row>
          <Row>
            <p>Address Line 1<br></br>Address Line 2</p>
          </Row>
        </Col>
        <Col sm md='3' className='m-1 ms-2'>
          <h4>Site Menu</h4>
          <Row><NavLink to='/'>Resources</NavLink></Row>
          <Row><NavLink to='/events'>Events</NavLink></Row>
          <Row><NavLink to='/about'>About</NavLink></Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;