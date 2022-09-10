import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import './resource-card.css';

function ResourceCard(props) {
  const { resource } = props;
  const [show, setShow] = useState(false);

  // Sort populations and services list for each resource (A-Z)
  let resourcePop = resource.populationFilters.sort();
  let resourceServ = resource.serviceFilters.sort();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card>
        <Card.Body className='text-bg-light'>
          <Card.Title>{resource.provider}</Card.Title>
          <Card.Subtitle className='mb-3'>{resource.address}</Card.Subtitle>
          <Card.Text>
            { (resource.website) ? 
              <Card.Link href={resource.website} target="_blank">See Website</Card.Link>
            : null }
            <Card.Link href={`tel:`+resource.phone} target="_blank">Call {resource.phone}</Card.Link>
          </Card.Text>
          <Card.Text>{resource.description}</Card.Text>
          <h5>Services:</h5>
          {resourceServ.map(s => (
            <ListGroup horizontal className='filter-list m-1'>
              <ListGroup.Item variant='primary'>{s}</ListGroup.Item>
            </ListGroup>
          ))}
          { (resourcePop.length !== 0) ?
            <>
              <h5>Populations:</h5>
                {resourcePop.map(p => (
                  <ListGroup horizontal className='filter-list m-1'>
                    <ListGroup.Item variant='secondary'>{p}</ListGroup.Item>
                  </ListGroup>
                ))}
            </>
            : null }
          <Card.Text className='text-end'>
            <Button variant='link' className='p-0' onClick={handleShow}><i class="bi bi-pencil-square"></i></Button>
          </Card.Text>
        </Card.Body>
      </Card>
      {/* Request an edit form modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-bg-light'>Request an Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-bg-light'>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    
  );
}

export default ResourceCard;