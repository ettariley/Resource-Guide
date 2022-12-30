import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';

function AddEvent() {
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const selected = location.state?.selected;
  const requestInfo = useRef(Object.keys(selected).length);

  useEffect(() => {
    if (requestInfo.current > 0) {
      setShowAlert(true);
    }
    
    return () => {
      requestInfo.current = 0;
    };
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
    requestInfo.current = 0;
  };

  return (
    <Container className='mt-5 pt-5'>
      <h2>Add Event</h2>
      {showAlert ? (
        <Alert variant="primary" onClose={() => closeAlert()} dismissible>
          <Alert.Heading>New Event Request Information</Alert.Heading>
          Title: {selected.title}<br></br>
          Event Start: {selected.start.toDateString()}<br></br>
          Event End: {selected.end.toDateString()}<br></br>
          Host: {selected.eventHost}<br></br>
          Description: {selected.description}<br></br>
          Location: {selected.location}<br></br>
          Phone: {selected.hostPhone}<br></br>
          Event Link: {selected.eventLink}<br></br>
          Person Requesting: {selected.identifier}<br></br>
          Date Submitted: {selected.dateSubmitted.toDateString()}
      </Alert>
      ) : null}
      {/* Return to admin dashboard button */}
      <Row className='mt-5'>
        <Col className='ps-0'>
          <Button variant="outline-light" size='sm' as={Link} to="/admin">
            <i className="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default AddEvent;