import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
import SuccessModal from '../success-modal/success-modal';
import './resource-card.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

function ResourceCard(props) {
  const { resource } = props;
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formIdentifier, setFormIdentifier] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEditRequest, setFormEditRequest] = useState('');
  // const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  const resourcePop = useRef(resource.populationFilters.sort());
  const resourceServ = useRef(resource.serviceFilters.sort());

  const onIdentifierChange = (value) => {
    setFormIdentifier(value);
    if ( !errors[formIdentifier] ) setErrors({
      ...errors,
      "formIdentifier": null
    })
  };

  const onPhoneChange = (phone) => {
    setFormPhone(phone);
    if ( !errors[formPhone] ) setErrors({
      ...errors,
      "formPhone": null
    })
  };

  const onEditRequestChange = (editText) => {
    setFormEditRequest(editText);
    if ( !errors[formEditRequest] ) setErrors({
      ...errors,
      "formEditRequest": null
    })
  };

  const findFormErrors = () => {
    const newErrors = {};
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!formIdentifier || formIdentifier === '') {
      newErrors.formIdentifier = 'Required';
    }
    if (!formPhone || formPhone === '') {
      newErrors.formPhone = 'Required';
    } else if (!formPhone.match(phoneno)) {
      newErrors.formPhone =
        'Phone number should be in 123-456-7890 or 123.456.7890 format.';
    }
    if (!formEditRequest || formEditRequest === '') {
      newErrors.formEditRequest = 'Required';
    }

    return newErrors;
  };

  const handleCloseFormModal = () => setShowFormModal(false);
  const handleShowFormModal = () => setShowFormModal(true);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);

  const handleSubmitandClose = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const editRequestRef = addDoc(collection(db, 'Edit-Requests'), {
        dateSubmitted: new Date(),
        editRequest: formEditRequest,
        identifier: formIdentifier,
        phone: formPhone,
        provider: resource.provider,
        read: false,
      }).then(() => {
        handleCloseFormModal();
        handleShowSuccessModal();
      });
    }
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
          {resourceServ.current.map((s) => (
            <ListGroup key={s} horizontal className="filter-list m-1">
              <ListGroup.Item variant="primary">{s}</ListGroup.Item>
            </ListGroup>
          ))}
          {resourcePop.current.at(0) !== '' ? (
            <>
              <h5>Populations:</h5>
              {resourcePop.current.map((p) => (
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
                <i className="bi bi-pencil-square"></i>
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
          <Form noValidate>
            <Form.Group
              className="mb-3"
              controlId="editResourceForm.Identifier"
            >
              <Form.Label>I am a...*</Form.Label>
              <Form.Check
                type="radio"
                label="Community Member"
                value="Community Member"
                name="editResourceFormRadios"
                id="editResourceFormRadios1"
                onChange={(e) => onIdentifierChange(e.target.value)}
                isInvalid={errors.formIdentifier}
              />
              <Form.Check
                type="radio"
                label="Employee of this Provider"
                value="Employee of this Provider"
                name="editResourceFormRadios"
                id="editResourceFormRadios2"
                onChange={(e) => onIdentifierChange(e.target.value)}
                isInvalid={errors.formIdentifier}
              />
              <Form.Check
                type="radio"
                label="Employee of another Provider"
                value="Employee of another Provider"
                name="editResourceFormRadios"
                id="editResourceFormRadios3"
                onChange={(e) => onIdentifierChange(e.target.value)}
                isInvalid={errors.formIdentifier}
              />
              <Form.Control.Feedback type="invalid">
                {errors.formIdentifier}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="editResourceForm.Phone">
              <Form.Label>
                Please leave a phone number if we need to contact you about this
                request:*
              </Form.Label>
              <Form.Control
                type="tel"
                required
                value={formPhone}
                onChange={(e) => onPhoneChange(e.target.value)}
                isInvalid={errors.formPhone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.formPhone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="editResourceForm.EditRequest"
            >
              <Form.Label>Edit Requested*</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                value={formEditRequest}
                onChange={(e) => onEditRequestChange(e.target.value)}
                isInvalid={errors.formEditRequest}
              />
              <Form.Control.Feedback type="invalid">
                {errors.formEditRequest}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            type="submit"
            onClick={handleSubmitandClose}
          >
            Submit
          </Button>
          <Button variant="primary" onClick={handleCloseFormModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Form Submit Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        handleCloseSuccessModal={handleCloseSuccessModal}
      />
    </>
  );
}

export default ResourceCard;
