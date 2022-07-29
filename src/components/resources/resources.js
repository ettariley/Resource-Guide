import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResourceCard from '../resource-card/resource-card';
import { mockResources } from '../mock-data';

function Resources() {
  let resources = mockResources;

  return (
    <Container className='pt-2'>
      <h2>Resources</h2>
      <Row>
        {resources.map(r => (
          <Col>
            <ResourceCard resource={r} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Resources;