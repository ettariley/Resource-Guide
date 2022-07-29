import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function ResourceCard(props) {
  const { resource } = props;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{resource.provider}</Card.Title>
        <Card.Text>{resource.description}</Card.Text>
        <Card.Text>{resource.phone}</Card.Text>
        <Card.Text>{resource.address}</Card.Text>
        <h5>Services:</h5>
        <ListGroup horizontal className='pb-3'>
          {resource.serviceFilters.map(s => (
            <ListGroup.Item variant='primary'>{s}</ListGroup.Item>
          ))}
        </ListGroup>
        { (resource.populationFilters.length !== 0) ?
          <>
            <h5>Populations:</h5>
            <ListGroup horizontal>
              {resource.populationFilters.map(p => (
                <ListGroup.Item variant='secondary'>{p}</ListGroup.Item>
              ))}
            </ListGroup>
          </>
          : null }
        <Button variant="primary" href={resource.website} target="_blank" className='mt-3'>See Website</Button>
      </Card.Body>
    </Card>
  );
}

export default ResourceCard;