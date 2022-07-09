import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ResourceCard(props) {
  const { resource } = props;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{resource.provider}</Card.Title>
        <Card.Text>{resource.description}</Card.Text>
        <Card.Text>{resource.phone}</Card.Text>
        <Card.Text>{resource.address}</Card.Text>
        <Card.Text>{resource.serviceFilters}</Card.Text>
        <Card.Text>{resource.populationFilters}</Card.Text>
        <Button variant="primary" href={resource.website} target="_blank">See Website</Button>
      </Card.Body>
    </Card>
  );
}

export default ResourceCard;