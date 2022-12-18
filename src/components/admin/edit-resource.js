import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function EditResource(props) {
  const { selected } = props;

  return (
    <Container className='mt-5 pt-5'>
      <h2>Edit Resource</h2>
    </Container>
  )
}

export default EditResource;