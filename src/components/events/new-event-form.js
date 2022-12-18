import React, { useEffect, useRef, useState } from 'react';
import { Formik, Field } from 'formik';
import uuid from 'react-uuid';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { collection, addDoc } from 'firebase/firestore';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { db } from '../../firebase';
import './events.css';

function NewEventForm(props) {
  const { handleCloseNewEventModal, handleShowSuccessModal } = props;
  const [newEventIdentifier, setNewEventIdentifier] = useState('');
  const [newEventHost, setNewEventHost] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventAddress, setNewEventAddress] = useState('');
  const [newEventPhone, setNewEventPhone] = useState('');
  const [newEventLink, setNewEventLink] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStart, setNewEventStart] = useState(new Date());
  const [newEventEnd, setNewEventEnd] = useState(new Date());
  const [errors, setErrors] = useState({});

  const onFormChange = (type, value) => {
    switch (type) {
      case 'identifier':
        setNewEventIdentifier(value);
        if (!errors[newEventIdentifier])
          setErrors({ ...errors, newEventIdentifier: null });
        break;
      case 'host':
        setNewEventHost(value);
        if (!errors[newEventHost]) setErrors({ ...errors, newEventHost: null });
        break;
      case 'name':
        setNewEventName(value);
        if (!errors[newEventName]) setErrors({ ...errors, newEventName: null });
        break;
      case 'address':
        setNewEventAddress(value);
        if (!errors[newEventAddress])
          setErrors({ ...errors, newEventAddress: null });
        break;
      case 'phone':
        setNewEventPhone(value);
        if (!errors[newEventPhone])
          setErrors({ ...errors, newEventPhone: null });
        break;
      case 'link':
        setNewEventLink(value);
        break;
      case 'description':
        setNewEventDescription(value);
        if (!errors[newEventDescription])
          setErrors({ ...errors, newEventDescription: null });
        break;
      case 'start':
        setNewEventStart(value);
        if (!errors[newEventStart])
          setErrors({ ...errors, newEventStart: null });
        break;
      case 'end':
        setNewEventEnd(value);
        if (!errors[newEventEnd]) setErrors({ ...errors, newEventEnd: null });
        break;
      default:
        break;
    }
    console.log(errors);
  };

  const findFormErrors = () => {
    const newErrors = {};
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!newEventIdentifier || newEventIdentifier === '') {
      newErrors.newEventIdentifier = 'Required';
    }
    if (!newEventHost || newEventHost === '') {
      newErrors.newEventHost = 'Required';
    }
    if (!newEventName || newEventName === '') {
      newErrors.newEventName = 'Required';
    }
    if (!newEventStart) {
      newErrors.newEventStart = 'Required';
    } else if (newEventStart <= new Date()) {
      newErrors.newEventStart = 'Date must be in the future.'
    }
    if (!newEventEnd) {
      newErrors.newEventEnd = 'Required';
    } else if (newEventEnd <= new Date() || newEventEnd <= newEventStart) {
      newErrors.newEventEnd = 'Date/Time must be after the start date.'
    }
    if (!newEventAddress || newEventAddress === '') {
      newErrors.newEventAddress = 'Required';
    }
    if (newEventPhone !== '' && !newEventPhone.match(phoneno)) {
      newErrors.newEventPhone =
        'Phone number should be in 123-456-7890 or 123.456.7890 format.';
    }
    if (!newEventDescription || newEventDescription === '') {
      newErrors.newEventDescription = 'Required';
    }

    return newErrors;
  };

  const handleSubmitEventandClose = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const eventRequestRef = addDoc(collection(db, 'Event-Requests'), {
        dateSubmitted: new Date(),
        id: uuid(),
        identifier: newEventIdentifier,
        hostPhone: newEventPhone || null,
        description: newEventDescription,
        end: newEventEnd,
        start: newEventStart,
        eventHost: newEventHost,
        eventLink: newEventLink || null,
        location: newEventAddress,
        title: newEventName,
        read: false,
      }).then(() => {
        handleCloseNewEventModal();
        handleShowSuccessModal();
      });
    }
  };

  return (
    <Form noValidate>
      <Form.Group className="mb-3" controlId="newEventForm.Identifier">
        <Form.Label>I am a...</Form.Label>
        <Form.Check
          type="radio"
          label="Host of this Event"
          value="Host of this Event"
          name="newEventIdentifier"
          id="newEventFormRadios1"
          isInvalid={errors.newEventIdentifier}
          onChange={(e) => onFormChange('identifier', e.target.value)}
        />
        <Form.Check
          type="radio"
          label="Community Member"
          value="Community Member"
          name="newEventIdentifier"
          id="newEventFormRadios2"
          isInvalid={errors.newEventIdentifier}
          onChange={(e) => onFormChange('identifier', e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.newEventIdentifier}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newEventForm.Host">
        <Form.Label>Host Organization:</Form.Label>
        <Form.Control
          type="text"
          name="newEventHost"
          value={newEventHost}
          isInvalid={errors.newEventHost}
          onChange={(e) => onFormChange('host', e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.newEventHost}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newEventForm.Title">
        <Form.Label>Event Name:</Form.Label>
        <Form.Control
          type="text"
          name="newEventName"
          value={newEventName}
          isInvalid={errors.newEventName}
          onChange={(e) => onFormChange('name', e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.newEventName}
        </Form.Control.Feedback>
      </Form.Group>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="newEventForm.StartDate" className=''>
            <Form.Label>Event Start:</Form.Label>
            <p className='mb-1'>
              <DateTimePicker
                required
                disableClock
                name="newEventStart"
                value={newEventStart}
                // isInvalid={errors.newEventStart}
                onChange={(datetime) => onFormChange('start', datetime)}
              />
            </p>          
          <Form.Text muted>(set time to 12:00 AM if all day event)</Form.Text>
          {errors.newEventStart !== '' ? (
            <p className='text-danger' style={{fontSize: '0.875em'}}>
              {errors.newEventStart}
            </p>
          ) : null}
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="newEventForm.EndDate">
          <Form.Label>Event End:</Form.Label>
          <p className='mb-1'>
            <DateTimePicker
              required
              disableClock
              name="newEventEnd"
              value={newEventEnd}
              // isInvalid={errors.newEventEnd}
              onChange={setNewEventEnd}
              className=''
            />
          </p>
          <Form.Text muted>(set time to 11:59 PM if all day event)</Form.Text>
          {errors.newEventEnd !== null ? (
            <p className='text-danger' style={{fontSize: '0.875em'}}>
              {errors.newEventEnd}
            </p>
          ) : null}
        </Form.Group>
      </Row>
      <Form.Group className="mb-3" controlId="newEventForm.Address">
        <Form.Label>Event Location:</Form.Label>
        <Form.Control
          type="text"
          name="newEventAddress"
          value={newEventAddress}
          isInvalid={errors.newEventAddress}
          onChange={(e) => onFormChange('address', e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.newEventAddress}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newEventForm.HostPhone">
        <Form.Label>Host Phone:</Form.Label>
        <Form.Control
          type="tel"
          name="newEventPhone"
          value={newEventPhone}
          isInvalid={errors.newEventPhone}
          onChange={(e) => onFormChange('phone', e.target.value)}
        />
        <Form.Text muted>Optional</Form.Text>
        <Form.Control.Feedback type="invalid">
          {errors.newEventPhone}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newEventForm.EventLink">
        <Form.Label>Event Link:</Form.Label>
        <Form.Control
          type="url"
          name="newEventLink"
          value={newEventLink}
          onChange={(e) => onFormChange('end', e.target.value)}
        />
        <Form.Text muted>Optional</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="newEventForm.Description">
        <Form.Label>Provide a short description of the event.</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="newEventDescription"
          value={newEventDescription}
          isInvalid={errors.newEventDescription}
          onChange={(e) => onFormChange('description', e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.newEventDescription}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="secondary" type="submit" onClick={handleSubmitEventandClose}>
        Submit
      </Button>
    </Form>
  );
}

export default NewEventForm;
