import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './footer.css';

function Footer() {
  return (
    <Container fluid className='footer position-absolute bottom-0'>
      <Row>
        <Col>Footer column 1</Col>
        <Col>Footer column 2</Col>
        <Col>Footer column 3</Col>
      </Row>
    </Container>
  );
}

export default Footer;