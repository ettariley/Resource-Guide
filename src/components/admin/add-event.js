import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getCountFromServer,
  doc,
  getDoc,
} from 'firebase/firestore';
import './admin.css';

function AddEvent() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const location = useLocation();
  const selected = location.state?.selected;
  const requestInfo = useRef(Object.keys(selected).length);
  const events = collection(db, 'Events');
  const localizer = momentLocalizer(moment);

  const [newEventHost, setNewEventHost] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventAddress, setNewEventAddress] = useState('');
  const [newEventPhone, setNewEventPhone] = useState('');
  const [newEventLink, setNewEventLink] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventPopulation, setNewEventPopulation] = useState('');
  const [newEventTags, setNewEventTags] = useState([]);
  const [newEventStart, setNewEventStart] = useState(new Date());
  const [newEventEnd, setNewEventEnd] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [tags, setTags] = useState([]);
  const [populations, setPopulations] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const onNewEventChange = (type, value) => {
    switch (type) {
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
      case 'population':
        setNewEventPopulation(value);
        if (!errors[newEventPopulation])
          setErrors({ ...errors, newEventPopulation: null });
        break;
      case 'tags':
        if (!newEventTags.includes(value)) {
          setNewEventTags([...newEventTags, value]);
        } else {
          setNewEventTags(newEventTags.filter((r) => r !== value));
        }
        if (!errors[newEventTags]) setErrors({ ...errors, newEventTags: null });
        break;
      default:
        break;
    }
    // console.log(errors);
  };

  const findFormErrors = () => {
    const newErrors = {};
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!newEventHost || newEventHost === '') {
      newErrors.newEventHost = 'Required';
    }
    if (!newEventName || newEventName === '') {
      newErrors.newEventName = 'Required';
    }
    if (!newEventStart) {
      newErrors.newEventStart = 'Required';
    } else if (newEventStart <= new Date()) {
      newErrors.newEventStart = 'Date must be in the future.';
    }
    if (!newEventEnd) {
      newErrors.newEventEnd = 'Required';
    } else if (newEventEnd <= new Date() || newEventEnd <= newEventStart) {
      newErrors.newEventEnd = 'Date/Time must be after the start date.';
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

  const clearFormFields = () => {
    setNewEventAddress('');
    setNewEventHost('');
    setNewEventName('');
    setNewEventPhone('');
    setNewEventLink('');
    setNewEventDescription('');
    setNewEventPopulation('');
    setNewEventTags([]);
    setNewEventStart(new Date());
    setNewEventEnd(new Date());
  };

  const resetForm = () => {
    clearFormFields();
    setShowPreview(false);
  };

  const closeModalAndReset = () => {
    setShowDuplicateModal(false);
    resetForm();
  };

  const handlePreview = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setShowPreview(true);
    }
  };

  const hasTags = () => {
    if (newEventTags.at(0) === '') {
      return false;
    } else if (newEventTags.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const addNewEvent = () => {
    const newEventRef = addDoc(events, {
      hostPhone: newEventPhone || null,
      description: newEventDescription,
      end: newEventEnd,
      start: newEventStart,
      eventHost: newEventHost,
      eventLink: newEventLink || null,
      location: newEventAddress,
      title: newEventName,
      population: newEventPopulation || null,
      tags: newEventTags || null,
    }).then(() => {
      resetForm();
      setShowAlert(false);
      setShowSuccessModal(true);
    });
  };

  const handleSubmitNewEvent = async () => {
    // check for event title
    const eventsQuery = query(events, where('title', '==', newEventName));
    const eventsSnapshot = await getCountFromServer(eventsQuery);
    const duplicateCount = eventsSnapshot.data().count;
    let d1 = [];
    let d2 = [];
    let d3 = [];
    console.log(duplicateCount);
    // if duplicate titles found, pull the list
    if (duplicateCount > 0) {
      const duplicatesSnapshot = getDocs(eventsQuery).then((duplicatesSnapshot) => {
        duplicatesSnapshot.forEach((doc) => {
          let data = doc.data();
          d1.push({
            id: doc.id,
            start: data.start.toDate(),
            end: data.end.toDate(),
            title: data.title,
          });
        });
        // filter list for events with the same start date
        d2 = d1.filter(d => d.start.toDateString() === newEventStart.toDateString());
        // if there's at least one, then filter for same end date
        if (Object.keys(d2).length > 0) {
          d3 = d2.filter(d => d.end.toDateString() === newEventEnd.toDateString());
          // if there is one, show duplicate modal
          if (Object.keys(d3).length > 0) {
            setShowDuplicateModal(true);
          } else {
            addNewEvent();
          }
        } else {
          addNewEvent();
        }
      })
    } else {
      addNewEvent();
    }
  };

  // Check for alert info
  useEffect(() => {
    if (requestInfo.current > 0) {
      setShowAlert(true);
    }

    return () => {
      requestInfo.current = 0;
    };
  }, []);

  // Set population filters list
  useEffect(() => {
    const populationFilterQuery = query(doc(db, 'Filters', 'Populations'));
    const populationsSnapshot = getDoc(populationFilterQuery).then(
      (populationsSnapshot) => {
        setPopulations(populationsSnapshot.data().filters.sort());
      }
    );
  }, []);

  // Set event tags list
  useEffect(() => {
    const eventTagsQuery = query(doc(db, 'Filters', 'EventTags'));
    const eventTagsSnapshot = getDoc(eventTagsQuery).then(
      (eventTagsSnapshot) => {
        setTags(eventTagsSnapshot.data().tags.sort());
      }
    );
  }, []);

  const closeAlert = () => {
    setShowAlert(false);
    requestInfo.current = 0;
  };

  // format display of event start and end dates and times
  const getFormattedEventDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // if all day event, only display start and end dates
    if (
      startDate.toDateString() !== endDate.toDateString() &&
      startDate.toTimeString() ===
        '00:00:00 GMT-0400 (Eastern Daylight Time)' &&
      endDate.toTimeString() === '00:00:00 GMT-0400 (Eastern Daylight Time)'
    ) {
      return (
        startDate.toLocaleDateString(localizer, { dateStyle: 'long' }) +
        ' to ' +
        endDate.toLocaleDateString(localizer, { dateStyle: 'long' })
      );
    }
    if (
      startDate.toDateString() !== endDate.toDateString() &&
      startDate.toTimeString() ===
        '00:00:00 GMT-0500 (Eastern Standard Time)' &&
      endDate.toTimeString() === '00:00:00 GMT-0500 (Eastern Standard Time)'
    ) {
      return (
        startDate.toLocaleDateString(localizer, { dateStyle: 'long' }) +
        ' to ' +
        endDate.toLocaleDateString(localizer, { dateStyle: 'long' })
      );
    }
    // if 1 day event, don't display end date
    else if (startDate.toDateString() === endDate.toDateString()) {
      return (
        startDate.toLocaleDateString(localizer, { dateStyle: 'long' }) +
        ', ' +
        startDate.toLocaleTimeString(localizer, { timeStyle: 'short' }) +
        ' to ' +
        endDate.toLocaleTimeString(localizer, { timeStyle: 'short' })
      );
    } else {
      return (
        startDate.toLocaleString(localizer, {
          dateStyle: 'long',
          timeStyle: 'short',
        }) +
        ' to ' +
        endDate.toLocaleString(localizer, {
          dateStyle: 'long',
          timeStyle: 'short',
        })
      );
    }
  };

  return (
    <Container className="mt-5 pt-5">
      <h2>Add Event</h2>
      {showAlert ? (
        <Alert variant="primary" onClose={() => closeAlert()} dismissible>
          <Alert.Heading>New Event Request Information</Alert.Heading>
          Title: {selected.title}
          <br></br>
          Event Start: {selected.start.toDateString()}
          <br></br>
          Event End: {selected.end.toDateString()}
          <br></br>
          Host: {selected.eventHost}
          <br></br>
          Description: {selected.description}
          <br></br>
          Location: {selected.location}
          <br></br>
          Phone: {selected.hostPhone}
          <br></br>
          Event Link: {selected.eventLink}
          <br></br>
          Person Requesting: {selected.identifier}
          <br></br>
          Date Submitted: {selected.dateSubmitted.toDateString()}
        </Alert>
      ) : null}
      <Row>
        <Col>
          <Form noValidate>
            <Form.Group className="mb-3" controlId="newEventForm.Host">
              <Form.Label>Host Organization:</Form.Label>
              <Form.Control
                type="text"
                name="newEventHost"
                value={newEventHost}
                isInvalid={errors.newEventHost}
                onChange={(e) => onNewEventChange('host', e.target.value)}
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
                onChange={(e) => onNewEventChange('name', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newEventName}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="newEventForm.StartDate"
                className=""
              >
                <Form.Label>Event Start:</Form.Label>
                <p className="mb-1">
                  <DateTimePicker
                    required
                    disableClock
                    name="newEventStart"
                    value={newEventStart}
                    // isInvalid={errors.newEventStart}
                    onChange={(datetime) => onNewEventChange('start', datetime)}
                  />
                </p>
                <Form.Text muted>
                  (set time to 12:00 AM if all day event)
                </Form.Text>
                {errors.newEventStart !== '' ? (
                  <p className="text-danger" style={{ fontSize: '0.875em' }}>
                    {errors.newEventStart}
                  </p>
                ) : null}
              </Form.Group>
              <Form.Group as={Col} controlId="newEventForm.EndDate">
                <Form.Label>Event End:</Form.Label>
                <p className="mb-1">
                  <DateTimePicker
                    required
                    disableClock
                    name="newEventEnd"
                    value={newEventEnd}
                    // isInvalid={errors.newEventEnd}
                    onChange={setNewEventEnd}
                    className=""
                  />
                </p>
                <Form.Text muted>
                  (set time to 11:59 PM if all day event)
                </Form.Text>
                {errors.newEventEnd !== null ? (
                  <p className="text-danger" style={{ fontSize: '0.875em' }}>
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
                onChange={(e) => onNewEventChange('address', e.target.value)}
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
                onChange={(e) => onNewEventChange('phone', e.target.value)}
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
                onChange={(e) => onNewEventChange('link', e.target.value)}
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
                onChange={(e) =>
                  onNewEventChange('description', e.target.value)
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.newEventDescription}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="newEventForm.Populations">
              <Form.Label className="pe-3">
                Population (if applicable):{' '}
              </Form.Label>
              {populations.map((p) => (
                <Form.Check
                  inline
                  type="radio"
                  label={p}
                  value={p}
                  name="newEventFormPopulationsCheck"
                  id={p}
                  checked={newEventPopulation === p}
                  onChange={(e) =>
                    onNewEventChange('population', e.target.value)
                  }
                />
              ))}
              <Form.Check
                inline
                type="radio"
                label="N/A"
                value="N/A"
                name="newEventFormPopulationsCheck"
                id="N/A"
                checked={newEventPopulation === ''}
                onChange={(e) => onNewEventChange('population', '')}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newEventForm.Tags">
              <Form.Label className="pe-3">Tags: </Form.Label>
              {tags.map((t) => (
                <Form.Check
                  inline
                  type="checkbox"
                  label={t}
                  value={t}
                  name="newEventFormProgramsCheck"
                  id={t}
                  onChange={(e) => onNewEventChange('tags', e.target.value)}
                  checked={newEventTags.includes(t)}
                />
              ))}
            </Form.Group>
          </Form>
          <button
            className="btn btn-secondary me-3"
            type="submit"
            onClick={handlePreview}
            disabled={showPreview}
          >
            Preview
          </button>
          <Button variant="danger" onClick={() => resetForm()}>
            Reset
          </Button>
        </Col>
        {showPreview ? (
          <Col>
            <h4>Preview:</h4>
            <Card className="text-bg-light">
              <Card.Body>
                <Card.Title>{newEventName}</Card.Title>
                <Card.Title>
                  {getFormattedEventDates(newEventStart, newEventEnd)}
                </Card.Title>
                <Card.Text className="fw-semibold">
                  Organizer: {newEventHost}
                  <br />
                  Location: {newEventAddress}
                </Card.Text>
                <Card.Text>
                  {newEventDescription}
                </Card.Text>
                {newEventPopulation !== '' ? (
                  <>
                    <h5>Population:</h5>
                    <ListGroup horizontal className="m-1">
                      <ListGroup.Item variant="secondary">
                        {newEventPopulation}
                      </ListGroup.Item>
                    </ListGroup>
                  </>
                ) : null}
                {hasTags() ? (
                  <>
                    <h5>Tag(s):</h5>
                    {newEventTags.map((t) => (
                      <ListGroup horizontal className="filter-list m-1">
                        <ListGroup.Item variant="secondary">{t}</ListGroup.Item>
                      </ListGroup>
                    ))}
                  </>
                ) : null}
                {newEventLink || newEventPhone ? (
                  <h5>Learn More</h5>
                ) : null}
                <Card.Text>
                  {newEventLink ? (
                    <Card.Link href={newEventLink} target="_blank">
                      Event Link
                    </Card.Link>
                  ) : null}
                  {newEventPhone ? (
                    <Card.Link href={`tel:` + newEventPhone} target="_blank">
                      Phone: {newEventPhone}
                    </Card.Link>
                  ) : null}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Alert variant="danger">
                  You can still make changes to the event in the form or reset
                  the form to clear all fields. If all information is correct,
                  select Add New Event.
                </Alert>
                <Button
                  className="w-100"
                  onClick={() => handleSubmitNewEvent()}
                >
                  Add New Event
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ) : null}
      </Row>
      {/* Return to admin dashboard button */}
      <Row className="mt-4 mb-2">
        <Col className="ps-0">
          <Button variant="outline-light" size="sm" as={Link} to="/admin">
            <i className="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
      {/* Duplicate resource modal */}
      <Modal
        show={showDuplicateModal}
        onHide={() => setShowDuplicateModal(false)}
      >
        <Modal.Header>
          <Modal.Title className="text-bg-light">
            Event Already Exists
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          An event with this title, start time, and end time already exists.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDuplicateModal(false)}
          >
            <Link to="/admin/edit-event" state={{ selected: {} }}>
              Edit Existing Event
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDuplicateModal(false)}
          >
            Edit New Event
          </Button>
          <Button variant="danger" onClick={closeModalAndReset}>
            Reset Form
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Success modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-bg-light">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">New event added!</Modal.Body>
      </Modal>
    </Container>
  );
}

export default AddEvent;
