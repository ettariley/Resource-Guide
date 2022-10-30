/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { mockEvents, mockPopulationFilters } from '../mock-data';
import SuccessModal from '../success-modal/success-modal';
import './events.css';

function Events() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchEventText, setSearchEventText] = useState('');
  const [eventPopFilter, setEventPopFilter] = useState('');

  const localizer = momentLocalizer(moment);

  let events = mockEvents;
  let populationFilters = mockPopulationFilters.sort();

  const handleCloseEventModal = () => setShowEventModal(false);
  const handleShowEventModal = (e) => {
    console.log(e);
    setEvent(e);
    setShowEventModal(true);
  };

  const handleCloseNewEventModal = () => setShowNewEventModal(false);
  const handleShowNewEventModal = () => setShowNewEventModal(true);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);

  const handleSubmitandClose = () => {
    handleCloseNewEventModal();
    handleShowSuccessModal();
  };

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

  // filter statements
  if (searchEventText !== "") {
    events = events.filter(e => e.title.toLowerCase().includes(searchEventText.toLowerCase()));
  }
  if (eventPopFilter !== "") {
    events = events.filter(p => p.population.includes(eventPopFilter));
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  return (
    <Fade in={open}>
      <Container className="events">
        <h2>Events</h2>
        <Row>
          <Col>
            <h4>Featured Events and Announcements</h4>
            <div className="bg-secondary bg-opacity-50 border border-2 border-secondary rounded mb-2 pt-3 ps-3 pe-3">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
          </Col>
        </Row>
        <h4>Event Calendar</h4>
        <Row className="mb-3">
          <Col md="auto">
            <h5 className="mt-2">Filter Events: </h5>
          </Col>
          {/* text search feature */}
          <Col md='4' className='p-2'>
            <Form.Control
              type="text"
              className="text-filter-form"
              value={searchEventText}
              onChange={(e) => setSearchEventText(e.target.value)}
              placeholder="Filter Events by Name"
            />
          </Col>
          {/* Population filter */}
          <Col md='auto' className='p-2'>
            <DropdownButton
              variant="secondary"
              id="population-filter-dropdown"
              title="Population"
              onSelect={(f) => setEventPopFilter(f)}
            >
              {populationFilters.map((f) => (
                <Dropdown.Item eventKey={f}>{f}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Show selected filters */}
          {(eventPopFilter !== '') ? (
            <Col md='auto' className='p-2'>
              <Button variant='outline-secondary' onClick={(e) => setEventPopFilter('')}>{eventPopFilter} | X</Button>
            </Col>
          ): null}
        </Row>
        <Row className="event-calendar">
          <Col>
            <Calendar
              localizer={localizer}
              showMultiDayTimes
              events={events}
              onSelectEvent={(e) => handleShowEventModal(e)}
              views={['month', 'week', 'day']}
              popup
            />
          </Col>
        </Row>
        {/* Event View Modal */}
        <Modal show={showEventModal} onHide={handleCloseEventModal}>
          <Modal.Header closeButton>
            <Modal.Title className="text-bg-light">{event.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            <Card.Title>
              {getFormattedEventDates(event.start, event.end)}
            </Card.Title>
            {/* <Card.Subtitle className='mb-2'>Organizer: {event.eventHost}</Card.Subtitle> */}
            <Card.Text className='fw-semibold'>
              Organizer: {event.eventHost}<br/>
              Location: {event.location}
            </Card.Text>
            <Card.Text>{event.description}</Card.Text>
            {(event.population !== '') ? (
              <>
                <h5>Populations:</h5>
                <ListGroup horizontal className="m-1">
                  <ListGroup.Item variant="secondary">{event.population}</ListGroup.Item>
                </ListGroup>
              </>
            ) : null}
            <h5>Learn More</h5>
            <Card.Text>
              {event.eventLink ? (
                <Card.Link href={event.eventLink} target="_blank">
                  Event Link
                </Card.Link>
              ) : null}
              {event.hostPhone ? (
                <Card.Link href={`tel:` + event.hostPhone} target="_blank">
                  Phone: {event.hostPhone}
                </Card.Link>
              ) : null}
            </Card.Text>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEventModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Share a new event */}
        <Row className="mt-2 pt-2 pb-2">
          <Col>
            <h4>Want to add an event to the calendar?</h4>
            <Button variant="secondary" onClick={handleShowNewEventModal}>
              Share a New Resource
            </Button>
          </Col>
        </Row>
        {/* Share a new event modal */}
        <Modal
          size="lg"
          show={showNewEventModal}
          onHide={handleCloseNewEventModal}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-bg-light">Share an Event</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            <Form>
              <Form.Group className="mb-3" controlId="newEventForm.Identifier">
                <Form.Label>I am a...</Form.Label>
                <Form.Check
                  required
                  type="radio"
                  label="Host of this Event"
                  name="newEventFormRadios"
                  id="newEventFormRadios1"
                />
                <Form.Check
                  required
                  type="radio"
                  label="Community Member"
                  name="newEventFormRadios"
                  id="newEventFormRadios2"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newEventForm.Host">
                <Form.Label>Host Organization:</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newEventForm.Title">
                <Form.Label>Event Title:</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="newEventForm.StartDate">
                  <Form.Label>Event Start Date:</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
                <Form.Group as={Col} controlId="newEventForm.StartTime">
                  <Form.Label>Event Start Time:</Form.Label>
                  <Form.Control type="text" />
                  <Form.Text muted>(leave blank if all day)</Form.Text>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="newEventForm.EndDate">
                  <Form.Label>Event End Date:</Form.Label>
                  <Form.Control type="text" />
                  <Form.Text muted>(if applicable)</Form.Text>
                </Form.Group>
                <Form.Group as={Col} controlId="newEventForm.EndTime">
                  <Form.Label>Event End Time:</Form.Label>
                  <Form.Control type="text" />
                  <Form.Text muted>(leave blank if all day)</Form.Text>
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="newEventForm.Address">
                <Form.Label>Event Location:</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newEventForm.HostPhone">
                <Form.Label>Host Phone:</Form.Label>
                <Form.Control type="text" required />
                <Form.Text muted>Optional</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="newEventForm.EventLink">
                <Form.Label>Event Link:</Form.Label>
                <Form.Control type="text" />
                <Form.Text muted>Optional</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="newEventForm.Description">
                <Form.Label>
                  Provide a short description of the event.
                </Form.Label>
                <Form.Control required as="textarea" rows={3} />
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
            <Button variant="primary" onClick={handleCloseNewEventModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Form Submit Success Modal */}
        <SuccessModal
          showSuccessModal={showSuccessModal}
          handleCloseSuccessModal={handleCloseSuccessModal}
        />
      </Container>
    </Fade>
  );
}

export default Events;
