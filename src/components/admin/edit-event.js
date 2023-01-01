import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import { Link } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import {
  query,
  where,
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  deleteDoc,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';

function EditEvent() {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [includePast, setIncludePast] = useState(false);
  const [active, setActive] = useState('0');
  // states and things specific to editing form (pull from add event & edit resource)
  const [eventPreviews, setEventPreviews] = useState([]);
  const [event, setEvent] = useState({});

  const [eventHost, setEventHost] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventPhone, setEventPhone] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPopulation, setEventPopulation] = useState('');
  const [eventTags, setEventTags] = useState([]);
  const [eventStart, setEventStart] = useState(new Date());
  const [eventEnd, setEventEnd] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [populationFilters, setPopulationFilters] = useState([]);
  const [tags, setTags] = useState([]);

  // refs for search info
  const searchText = useRef('');
  const searchLength = useRef(-1);
  const eventSelected = useRef(false);
  // set events collection call to variable
  const events = collection(db, 'Events');
  const localizer = momentLocalizer(moment);

  const handleCloseDeleteWarn = () => setShowDeleteWarn(false);
  const handleShowDeleteWarn = () => setShowDeleteWarn(true);

  const updateSearchText = (value) => {
    searchText.current = value;
  };

  const updateIncludePast = () => {
    setIncludePast(!includePast);
  };

  const toggleActive = () => {
    if (!readOnly) {
      setActive('1');
    } else if (active === '0') {
      setActive('1');
    } else {
      setActive('0');
    }
  };

  const isPast = (startDate) => {
    if (startDate <= new Date()) {
      return true;
    } else {
      return false;
    }
  };

  // get list of events on search DONE
  const searchEvents = () => {
    setEvent({});
    eventSelected.current = false;
    // get all events with the same name & add to events array
    const eventsQuery = query(
      events,
      where('title', '==', searchText.current),
      orderBy('start')
    );
    let eventsArray = [];
    const eventsQSnap = getDocs(eventsQuery).then((eventsQSnap) => {
      eventsQSnap.forEach((doc) => {
        let data = doc.data();
        eventsArray.push({
          description: data.description,
          end: data.end.toDate(),
          eventHost: data.eventHost,
          eventLink: data.eventLink,
          hostPhone: data.hostPhone,
          id: doc.id,
          location: data.location,
          population: data.population,
          start: data.start.toDate(),
          tags: data.tags,
          title: data.title,
        });
      });
      // if including past, set array
      if (includePast) {
        setEventPreviews(eventsArray);
      } else {
        // if not, then filter out past dates
        setEventPreviews(
          eventsArray.filter((event) => event.start >= new Date())
        );
      }
      searchLength.current = Object.keys(eventsArray).length;
      setActive('0');
    });
  };

  // push selected event info to event state DONE
  const selectEvent = (selected) => {
    setEvent({
      description: selected.description,
      end: selected.end,
      eventHost: selected.eventHost,
      eventLink: selected.eventLink,
      hostPhone: selected.hostPhone,
      id: selected.id,
      location: selected.location,
      population: selected.population,
      start: selected.start,
      tags: selected.tags,
      title: selected.title,
    });
    eventSelected.current = true;
    toggleActive();
  };

  // set populate form states with selected event info & disable readOnly DONE
  const editEvent = (event) => {
    // set individual form states to specific event info
    setEventAddress(event.location);
    setEventHost(event.eventHost);
    setEventName(event.title);
    setEventPhone(event.hostPhone);
    setEventLink(event.eventLink);
    setEventDescription(event.description);
    setEventPopulation(event.population);
    setEventTags(event.tags);
    setEventStart(event.start);
    setEventEnd(event.end);
    // remove readonly formatting
    setReadOnly(false);
  };

  // reset individual form fields and enable readOnly DONE
  const cancelEdits = () => {
    setReadOnly(true);
    setErrors({});
    // set individual form states back to empty
    setEventAddress('');
    setEventHost('');
    setEventName('');
    setEventPhone('');
    setEventLink('');
    setEventDescription('');
    setEventPopulation('');
    setEventTags([]);
    setEventStart('');
    setEventEnd('');
  };

  // update readOnly information to form information DONE
  const updateReadOnly = () => {
    // setEvent to specific form information
    setEvent({
      ...event,
      hostPhone: eventPhone || null,
      description: eventDescription,
      end: eventEnd,
      start: eventStart,
      eventHost: eventHost,
      eventLink: eventLink || null,
      location: eventAddress,
      title: eventName,
      population: eventPopulation || null,
      tags: eventTags || null,
    });
  };

  // Set individual form fields and check for errors DONE
  const onEventChange = (type, value) => {
    switch (type) {
      case 'host':
        setEventHost(value);
        if (!errors[eventHost]) setErrors({ ...errors, eventHost: null });
        break;
      case 'name':
        setEventName(value);
        if (!errors[eventName]) setErrors({ ...errors, eventName: null });
        break;
      case 'address':
        setEventAddress(value);
        if (!errors[eventAddress]) setErrors({ ...errors, eventAddress: null });
        break;
      case 'phone':
        setEventPhone(value);
        if (!errors[eventPhone]) setErrors({ ...errors, eventPhone: null });
        break;
      case 'link':
        setEventLink(value);
        break;
      case 'description':
        setEventDescription(value);
        if (!errors[eventDescription])
          setErrors({ ...errors, eventDescription: null });
        break;
      case 'start':
        setEventStart(value);
        if (!errors[eventStart]) setErrors({ ...errors, eventStart: null });
        break;
      case 'end':
        setEventEnd(value);
        if (!errors[eventEnd]) setErrors({ ...errors, eventEnd: null });
        break;
      case 'population':
        setEventPopulation(value);
        if (!errors[eventPopulation])
          setErrors({ ...errors, eventPopulation: null });
        break;
      case 'tags':
        if (!eventTags.includes(value)) {
          setEventTags([...eventTags, value]);
        } else {
          setEventTags(eventTags.filter((r) => r !== value));
        }
        if (!errors[eventTags]) setErrors({ ...errors, eventTags: null });
        break;
      default:
        break;
    }
    // console.log(errors);
  };

  // find form errors DONE
  const findFormErrors = () => {
    const newErrors = {};
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!eventHost || eventHost === '') {
      newErrors.eventHost = 'Required';
    }
    if (!eventName || eventName === '') {
      newErrors.eventName = 'Required';
    }
    if (!eventStart) {
      newErrors.eventStart = 'Required';
    } else if (eventStart <= new Date()) {
      newErrors.eventStart = 'Date must be in the future.';
    }
    if (!eventEnd) {
      newErrors.eventEnd = 'Required';
    } else if (eventEnd <= new Date() || eventEnd <= eventStart) {
      newErrors.eventEnd = 'Date/Time must be after the start date.';
    }
    if (!eventAddress || eventAddress === '') {
      newErrors.eventAddress = 'Required';
    }
    if (eventPhone && !phoneno.test(eventPhone)) {
      newErrors.eventPhone =
        'Phone number should be in 123-456-7890 or 123.456.7890 format.';
    }
    if (!eventDescription || eventDescription === '') {
      newErrors.eventDescription = 'Required';
    }

    return newErrors;
  };

  // actually update doc in db, update readOnly info, set to readyOnly IN PROGRESS
  const updateEvent = () => {
    const updateDocRef = doc(events, event.id);
    updateDoc(updateDocRef, {
      hostPhone: eventPhone || null,
      description: eventDescription,
      end: eventEnd,
      start: eventStart,
      eventHost: eventHost,
      eventLink: eventLink || null,
      location: eventAddress,
      title: eventName,
      population: eventPopulation || null,
      tags: eventTags || null,
    }).then(() => {
      window.scrollTo(0, 0);
      setShowSuccessToast(true);
      updateReadOnly();
      setReadOnly(true);
    });
  };

  // check for errors, if none, then update event DONE
  const saveEdits = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      updateEvent();
    }
  };

  // actually delete event DONE
  const handleDeleteEvent = () => {
    const deleteDocRef = doc(events, event.id);
    deleteDoc(deleteDocRef).then(() => {
      setEventPreviews(
        eventPreviews.filter(ep => ep.id !== event.id)
      );
      cancelEdits();
      eventSelected.current = false;
      setEvent({});
      handleCloseDeleteWarn();
      toggleActive();
    });
  };

  // format display of event start and end dates and times DONE
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

  // Set population filters list DONE
  useEffect(() => {
    const populationFilterQuery = query(doc(db, 'Filters', 'Populations'));
    const populationsSnapshot = getDoc(populationFilterQuery).then(
      (populationsSnapshot) => {
        setPopulationFilters(populationsSnapshot.data().filters.sort());
      }
    );
  }, []);

  // Set event tags list DONE
  useEffect(() => {
    const eventTagsQuery = query(doc(db, 'Filters', 'EventTags'));
    const eventTagsSnapshot = getDoc(eventTagsQuery).then(
      (eventTagsSnapshot) => {
        setTags(eventTagsSnapshot.data().tags.sort());
      }
    );
  }, []);

  return (
    <Container className="mt-5 pt-5">
      <h2>Edit Event</h2>
      {/* Search for event */}
      <Row>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Enter Event Name"
            onChange={(e) => updateSearchText(e.target.value)}
          />
        </Col>
        <Col className="">
          <Button variant="secondary" onClick={searchEvents} disabled={!readOnly} className="me-3">
            Search
          </Button>
          <Form.Group className="mt-1" id="includePastCheckbox">
            <Form.Check
              type="checkbox"
              label="Include Past Events"
              value={includePast}
              onChange={() => updateIncludePast()}
              className=""
            />
          </Form.Group>
        </Col>
      </Row>
      {/* Preview Event */}
      <Row>
        {eventPreviews.length > 0 ? (
          <Col>
            <h4>Event Preview</h4>
            <Accordion defaultActiveKey="0" activeKey={active} flush className="bg-secondary">
              <Accordion.Item eventKey="0" className="bg-secondary">
                <Accordion.Header onClick={toggleActive} className="bg-secondary">
                  Select an Event to Edit
                </Accordion.Header>
                <Accordion.Body className="bg-secondary">
                  <Row className="gx-3">
                    {eventPreviews.map((ep) => (
                      <Col>
                        <Button variant='link' className='p-0 preview-cards w-100' onClick={() => selectEvent(ep)}>
                          <Card>
                            <Card.Header>
                              <h5 className="mb-0">{ep.title}</h5>
                            </Card.Header>
                            <Card.Body>
                              <Card.Subtitle>
                                {getFormattedEventDates(ep.start, ep.end)}
                              </Card.Subtitle>
                              <Card.Text>
                                <p className='mt-2 mb-2'>Host: {ep.eventHost}</p>
                                Description: {ep.description}
                              </Card.Text>
                            </Card.Body>
                            {isPast(ep.start) ? (
                              <Alert className='ms-2 mb-2 me-2' variant="danger">
                                This event has ended.
                              </Alert>
                            ) : null}
                          </Card>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        ) : null}
        {searchLength.current === 0 ? (
            <>
              <h4>No Events Found</h4>
              <Link to='/admin/add-event' state={{ selected: {} }} className='text-secondary fs-5'>Add New Event</Link>
              <Link to='/events'  className='text-secondary fs-5'>Check Event Calendar</Link>
            </>
          ) : null}
      </Row>
      {/* Edit event form */}
      <Row>
      {eventSelected.current ? (
        <Col className="pt-3 pb-3">
          <Card className="text-bg-light">
            <Card.Header>
              <Card.Title className='m-0'>Edit Selected Event</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form noValidate>
                <Form.Group className="mb-3" controlId="eventForm.Host">
                  <Form.Label>Host Organization:</Form.Label>
                  <Form.Control
                    type="text"
                    name="eventHost"
                    placeholder={event.eventHost}
                    readOnly={readOnly}
                    value={eventHost}
                    isInvalid={errors.eventHost}
                    onChange={(e) => onEventChange('host', e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.eventHost}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="eventForm.Title">
                  <Form.Label>Event Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="eventName"
                    placeholder={event.title}
                    readOnly={readOnly}
                    value={eventName}
                    isInvalid={errors.eventName}
                    onChange={(e) => onEventChange('name', e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.eventName}
                  </Form.Control.Feedback>
                </Form.Group>
                {!readOnly ? (
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      controlId="eventForm.StartDate"
                      className=""
                    >
                      <Form.Label>Event Start:</Form.Label>
                      <p className="mb-1">
                        <DateTimePicker
                          required
                          disableClock
                          name="eventStart"
                          value={eventStart}
                          onChange={(datetime) => onEventChange('start', datetime)}
                        />
                      </p>
                      <Form.Text muted>
                        (set time to 12:00 AM if all day event)
                      </Form.Text>
                      {errors.eventStart !== '' ? (
                        <p className="text-danger" style={{ fontSize: '0.875em' }}>
                          {errors.eventStart}
                        </p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} controlId="eventForm.EndDate">
                      <Form.Label>Event End:</Form.Label>
                      <p className="mb-1">
                        <DateTimePicker
                          required
                          disableClock
                          name="eventEnd"
                          value={eventEnd}
                          onChange={(datetime) => onEventChange('end', datetime)}
                        />
                      </p>
                      <Form.Text muted>
                        (set time to 11:59 PM if all day event)
                      </Form.Text>
                      {errors.eventEnd !== null ? (
                        <p className="text-danger" style={{ fontSize: '0.875em' }}>
                          {errors.eventEnd}
                        </p>
                      ) : null}
                    </Form.Group>
                  </Row>
                ) : (
                  <p>Time: {getFormattedEventDates(event.start, event.end)}</p>
                )}
                <Form.Group className="mb-3" controlId="eventForm.Address">
                  <Form.Label>Event Location:</Form.Label>
                  <Form.Control
                    type="text"
                    name="eventAddress"
                    placeholder={event.location}
                    readOnly={readOnly}
                    value={eventAddress}
                    isInvalid={errors.eventAddress}
                    onChange={(e) => onEventChange('address', e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.eventAddress}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="eventForm.HostPhone">
                  <Form.Label>Host Phone:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="eventPhone"
                    placeholder={event.hostPhone}
                    readOnly={readOnly}
                    value={eventPhone}
                    isInvalid={errors.eventPhone}
                    onChange={(e) => onEventChange('phone', e.target.value)}
                  />
                  <Form.Text muted>Optional</Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.eventPhone}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="eventForm.EventLink">
                  <Form.Label>Event Link:</Form.Label>
                  <Form.Control
                    type="url"
                    name="eventLink"
                    placeholder={event.eventLink}
                    readOnly={readOnly}
                    value={eventLink}
                    onChange={(e) => onEventChange('end', e.target.value)}
                  />
                  <Form.Text muted>Optional</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="eventForm.Description">
                  <Form.Label>Provide a short description of the event.</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="eventDescription"
                    placeholder={event.description}
                    readOnly={readOnly}
                    value={eventDescription}
                    isInvalid={errors.eventDescription}
                    onChange={(e) =>
                      onEventChange('description', e.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.eventDescription}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="eventForm.Populations">
                  <Form.Label className="pe-3">
                    Population (if applicable):{' '}
                  </Form.Label>
                  {readOnly ? (
                    <>
                      {populationFilters.map((p) => (
                        <Form.Check
                          inline
                          type="radio"
                          label={p}
                          name="eventFormPopulationsCheck"
                          id={p}
                          checked={event.population === p}
                          readOnly={readOnly}
                        />
                      ))}
                      <Form.Check
                        inline
                        type="radio"
                        label="N/A"
                        name="eventFormPopulationsCheck"
                        id="N/A"
                        checked={event.population === ''}
                        readOnly={readOnly}
                      />
                    </>
                  ) : (
                    <>
                      {populationFilters.map((p) => (
                        <Form.Check
                          inline
                          type="radio"
                          label={p}
                          value={p}
                          name="eventFormPopulationsCheck"
                          id={p}
                          checked={eventPopulation === p}
                          onChange={(e) =>
                            onEventChange('population', e.target.value)
                          }
                          readOnly={readOnly}
                        />
                      ))}
                      <Form.Check
                        inline
                        type="radio"
                        label="N/A"
                        value="N/A"
                        name="eventFormPopulationsCheck"
                        id="N/A"
                        checked={eventPopulation === ''}
                        onChange={(e) => onEventChange('population', '')}
                        readOnly={readOnly}
                      />
                    </>
                  )} 
                </Form.Group>
                <Form.Group className="mb-3" controlId="eventForm.Tags">
                  <Form.Label className="pe-3">Tags: </Form.Label>
                  {readOnly ? (
                    <>
                      {tags.map((t) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={t}
                          name="eventFormProgramsCheck"
                          id={t}
                          checked={event.tags.includes(t)}
                          readOnly={readOnly}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {tags.map((t) => (
                          <Form.Check
                            inline
                            type="checkbox"
                            label={t}
                            value={t}
                            name="eventFormProgramsCheck"
                            id={t}
                            onChange={(e) => onEventChange('tags', e.target.value)}
                            checked={eventTags.includes(t)}
                            readOnly={readOnly}
                          />
                        ))}
                    </>
                  )}
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>
              {!readOnly ? (
                <Card.Text>
                  <Button type='submit' className="me-2" onClick={(e) => saveEdits(e)}>
                    Save Edits
                  </Button>
                  <Button variant="danger" onClick={() => cancelEdits()}>
                    Cancel Edits
                  </Button>
                </Card.Text>
              ) : null}
              <Card.Text>
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => editEvent(event)}
                  disabled={!readOnly}
                >
                  Edit Resource
                </Button>
                <Button
                  variant="danger"
                  disabled={!readOnly}
                  onClick={handleShowDeleteWarn}
                >
                  Delete Resource
                </Button>
              </Card.Text>
            </Card.Footer>
          </Card>
        </Col>
      ) : null}
      </Row>
      {/* Return to admin dashboard button */}
      <Row className="mt-4 mb-2">
        <Col>
          <Button variant="outline-light" size="sm" as={Link} to="/admin">
            <i className="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
      {/* Edit Successful Toast */}
      <ToastContainer className="p-3" position="top-end">
        <Toast
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
          bg="secondary"
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>Your edits were saved.</Toast.Body>
        </Toast>
      </ToastContainer>
      {/* Delete Warn Modal */}
      <Modal show={showDeleteWarn} onHide={handleCloseDeleteWarn}>
        <Modal.Header className="text-bg-light" closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer className="text-bg-light">
          <Button variant="secondary" onClick={handleCloseDeleteWarn}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditEvent;
