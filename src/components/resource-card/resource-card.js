import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import './resource-card.css';

function ResourceCard(props) {
  const { resource } = props;
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sort populations and services list for each resource (A-Z)
  let resourcePop = resource.populationFilters.sort();
  let resourceServ = resource.serviceFilters.sort();

  const handleCloseFormModal = () => setShowFormModal(false);
  const handleShowFormModal = () => setShowFormModal(true);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);

  const handleSubmitandClose = () => {
    handleCloseFormModal();
    handleShowSuccessModal();
  };

  return (
    <>
      <Card>
        <Card.Body className="text-bg-light">
          <Card.Title>{resource.provider}</Card.Title>
          <Card.Subtitle className="mb-3">{resource.address}</Card.Subtitle>
          <Card.Text>
            {resource.website ? (
              <Card.Link href={resource.website} target="_blank">
                See Website
              </Card.Link>
            ) : null}
            <Card.Link href={`tel:` + resource.phone} target="_blank">
              Call {resource.phone}
            </Card.Link>
          </Card.Text>
          <Card.Text>{resource.description}</Card.Text>
          <h5>Services:</h5>
          {resourceServ.map((s) => (
            <ListGroup horizontal className="filter-list m-1">
              <ListGroup.Item variant="primary">{s}</ListGroup.Item>
            </ListGroup>
          ))}
          {resourcePop.length !== 0 ? (
            <>
              <h5>Populations:</h5>
              {resourcePop.map((p) => (
                <ListGroup horizontal className="filter-list m-1">
                  <ListGroup.Item variant="secondary">{p}</ListGroup.Item>
                </ListGroup>
              ))}
            </>
          ) : null}
          <Card.Text className="text-end">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Request an edit</Tooltip>}
            >
              <Button
                variant="link"
                className="p-0"
                onClick={handleShowFormModal}
              >
                <i class="bi bi-pencil-square"></i>
              </Button>
            </OverlayTrigger>
          </Card.Text>
        </Card.Body>
      </Card>
      {/* Request an edit form modal */}
      <Modal show={showFormModal} onHide={handleCloseFormModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-bg-light">Request an Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          <h5>Resource: {resource.provider}</h5>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="editResourceForm.Identifier"
            >
              <Form.Label>I am a...</Form.Label>
              <Form.Check
                required
                type="radio"
                label="Community Member"
                name="editResourceFormRadios"
                id="editResourceFormRadios1"
              />
              <Form.Check
                required
                type="radio"
                label="Employee of this Provider"
                name="editResourceFormRadios"
                id="editResourceFormRadios2"
              />
              <Form.Check
                required
                type="radio"
                label="Employee of another Provider"
                name="editResourceFormRadios"
                id="editResourceFormRadios3"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="editResourceForm.EditRequest"
            >
              <Form.Label>Edit Requested</Form.Label>
              <Form.Control required as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit" onClick={handleSubmitandClose}>
            Submit
          </Button>
          <Button variant="primary" onClick={handleCloseFormModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Form Submit Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-bg-light">Request Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          Your request has been sent to our admin.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResourceCard;
