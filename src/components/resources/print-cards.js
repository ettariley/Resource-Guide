import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import './resources.css';

function PrintCards(props) {
  const { resource } = props;

  const resourcePop = useRef(resource.populationFilters.sort().join(', '));
  const resourceServ = useRef(resource.serviceFilters.sort().join(', '));

  const hasPops = () => {
    if (resourcePop.current.at(0) === '') {
      return false;
    } else if (resourcePop.current.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Card>
      <Card.Body className="text-bg-light">
        <Card.Title>{resource.provider}</Card.Title>
        <Card.Subtitle className="mb-1">{resource.address}</Card.Subtitle>
        <Row>
          <Card.Link href={`tel:` + resource.phone} target="_blank">
            {resource.phone}
          </Card.Link>
        </Row>
        {resource.website ? (
          <Row>
            <Card.Link href={resource.website} target="_blank">
              {resource.website}
            </Card.Link>
          </Row>
        ) : null}
        {resource.website ? (
          <Row>
            <Card.Link href={resource.website} target="_blank">
              ettahaselden@gmail.com
            </Card.Link>
          </Row>
        ) : null}
        <Card.Text className='mt-1 mb-2'>{resource.description}</Card.Text>
        <p className='mb-1'>
          <b>Services:</b> {resourceServ.current}
        </p>
        {hasPops() ? (
          <p className='mb-1'>
            <b>Populations:</b> {resourcePop.current}
          </p>
        ) : null}
      </Card.Body>
    </Card>
  );
}

export default PrintCards;
