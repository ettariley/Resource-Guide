import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { NavLink } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <Container fluid className="text-bg-dark bg-secondary">
      <Row className="p-3 justify-content-around">
        <Col sm md="3" className="m-1 me-2">
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
            <a href="tel:423-586-9431" title="Call">
              (423) 586-9431
            </a>
          </Row>
          <Row>
            <p>
              2450 S. Cumberland St.<br></br>Morristown, TN 37813
            </p>
          </Row>
        </Col>
        <Col md="5" className="m-1">
          <h4>Hamblen Resource Guide</h4>
          <h6>A partnership between</h6>
          <Row>
            <Col sm="auto">
              <a href="https://www.hcexcell.org/ready-by-6-1" target="_blank">
                <Image
                  fluid
                  className="footer-logos"
                  src={require('../../assets/Rb6logotest.png')}
                />
              </a>
            </Col>
            <Col sm="auto">
              <a href="https://www.mhcentralservices.org/" target="_blank">
                <Image
                  fluid
                  className="footer-logos"
                  src={require('../../assets/MHCSlogowhite.png')}
                />
              </a>
            </Col>
          </Row>
        </Col>

        <Col sm md="3" className="m-1 ms-2">
          <h4>Site Menu</h4>
          <Row>
            <NavLink to="/">Resources</NavLink>
          </Row>
          <Row>
            <NavLink to="/events">Events</NavLink>
          </Row>
          <Row>
            <NavLink to="/about">About</NavLink>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
