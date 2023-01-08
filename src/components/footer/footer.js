import React, { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import './footer.css';

function Footer() {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <Container fluid className="text-bg-dark bg-secondary no-print">
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
          <h6 className="pt-1 pb-0">
            Funded by grants from the East Tennessee Foundation & East Tennessee
            State University.
          </h6>
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
          <Button
            variant="link"
            ref={target}
            onClick={() => setShow(!show)}
            className="text-start text-white ps-0 pe-0 pt-1 pb-1"
          >
            <h5>Add Hamblen Resource Guide to your home screen</h5>
          </Button>
        </Col>
      </Row>
      <Overlay target={target.current} show={show} placement="top">
        <Tooltip id="add-to-home-screen-tooltip">
          On your mobile device, look for the{' '}
          <i className="bi bi-box-arrow-up"></i> or similar icon and select Add
          to Home Screen. This will add the Resource Guide to your device just
          like a regular app!
        </Tooltip>
      </Overlay>
    </Container>
  );
}

export default Footer;
