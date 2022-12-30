import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link, useLocation } from 'react-router-dom';

function EditResource() {
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
      <h2>Edit Resource</h2>
      {showAlert ? (
        <Alert variant="primary" onClose={() => closeAlert()} dismissible>
          <Alert.Heading>Edit Resource Request Information</Alert.Heading>
          Provider: {selected.provider}<br></br>
          Person Requesting: {selected.identifier}<br></br>
          Submission Contact Phone: {selected.phone}<br></br>
          Edit Requested: {selected.editRequest}<br></br>
          Date Submitted: {selected.dateSubmitted.toDateString()}<br></br>
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

export default EditResource;