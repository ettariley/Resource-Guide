import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function AddEvent() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <Container className='mt-5 pt-5'>
      <h2>Add Event</h2>
      {showAlert ? (
        <Alert variant="primary" onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>Resource Request Information</Alert.Heading>
          <p>
            Here's the information that was provided in the information. We need to build this part out to actually include this information.
          </p>
      </Alert>
      ) : null}
      {/* Return to admin dashboard button */}
      <Row className='mt-5'>
        <Col className='ps-0'>
          <Button variant="outline-light" size='sm' as={Link} to="/admin">
            <i class="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default AddEvent;