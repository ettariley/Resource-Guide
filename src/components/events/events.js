import React, { useEffect, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './events.css';

function Events() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  });

  return (
    <Fade in={open}>
      <Container className='events'>
        <h2>Events</h2>
        <Row>
          <Col>This is the events page.</Col>
        </Row>
      </Container>
    </Fade>
  );
}

export default Events;