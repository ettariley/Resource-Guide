import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './footer.css';

function Footer() {
  return (
    <Container fluid className='text-bg-dark position-absolute bottom-0'>
      <Row className='p-3'>
        <Col className='m-1 border border-light'>
          <p>Footer Section 1</p>
          <p>Footer Section 1</p>
          <p>Footer Section 1</p>
        </Col>
        <Col className='m-1 border border-light'>
          <p>Footer Section 2</p>
          <p>Footer Section 2</p>
          <p>Footer Section 2</p>
        </Col>
        <Col className='m-1 border border-light'>
          <p>Footer Section 3</p>
          <p>Footer Section 3</p>
          <p>Footer Section 3</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;