/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef, useState } from 'react';
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
import Alert from 'react-bootstrap/Alert';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import SuccessModal from '../success-modal/success-modal';
import uuid from 'react-uuid';
import DateTimePicker from 'react-datetime-picker';
import {
  query,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './events.css';
import NewEventForm from './new-event-form';

function Events() {
  const [open, setOpen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [event, setEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [featuredEventText, setFeaturedEventText] = useState('');
  const [displayFeaturedText, setDisplayFeaturedText] = useState(false);
  const [populationFilters, setPopulationFilters] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);

  const localizer = momentLocalizer(moment);

  // for setting filters
  const searchEventText = useRef('');
  const eventTagFilter = useRef('');
  const eventPopFilter = useRef('');
  let filteredArray = [];
  // let filteredEvents = [];

  // methods for updating refs
  const updateEventSearchText = (value) => {
    searchEventText.current = value;
    filterEvents();
  };
  const updateEventTagFilter = (tag) => {
    eventTagFilter.current = tag;
    filterEvents();
  };
  const updateEventPopFilter = (pop) => {
    eventPopFilter.current = pop;
    filterEvents();
  };

  const filterEvents = () => {
    switch (true) {
      case searchEventText.current !== '' &&
        eventTagFilter.current !== '' &&
        eventPopFilter.current !== '':
        filteredArray = filteredEvents.filter((v) =>
          v.title.toLowerCase().includes(searchEventText.current.toLowerCase())
        );
        filteredArray = filteredArray.filter((t) =>
          t.tags.includes(eventTagFilter.current)
        );
        filteredArray = filteredArray.filter((p) =>
          p.population.includes(eventPopFilter.current)
        );
        setFilteredEvents(filteredArray);
        break;
      case searchEventText.current !== '' && eventTagFilter.current !== '':
        filteredArray = filteredEvents.filter((v) =>
          v.title.toLowerCase().includes(searchEventText.current.toLowerCase())
        );
        filteredArray = filteredArray.filter((t) =>
          t.tags.includes(eventTagFilter.current)
        );
        setFilteredEvents(filteredArray);
        break;
      case searchEventText.current !== '' && eventPopFilter.current !== '':
        filteredArray = filteredEvents.filter((v) =>
          v.title.toLowerCase().includes(searchEventText.current.toLowerCase())
        );
        filteredArray = filteredArray.filter((p) =>
          p.population.includes(eventPopFilter.current)
        );
        setFilteredEvents(filteredArray);
        break;
      case eventTagFilter.current !== '' && eventPopFilter.current !== '':
        filteredArray = filteredEvents.filter((t) =>
          t.tags.includes(eventTagFilter.current)
        );
        filteredArray = filteredArray.filter((p) =>
          p.population.includes(eventPopFilter.current)
        );
        setFilteredEvents(filteredArray);
        break;
      case searchEventText.current !== '':
        setFilteredEvents(
          events.filter((v) =>
            v.title
              .toLowerCase()
              .includes(searchEventText.current.toLowerCase())
          )
        );
        break;
      case eventTagFilter.current !== '':
        setFilteredEvents(
          events.filter((t) => t.tags.includes(eventTagFilter.current))
        );
        break;
      case eventPopFilter.current !== '':
        setFilteredEvents(
          events.filter((p) => p.population.includes(eventPopFilter.current))
        );
        break;
      default:
        setFilteredEvents(events);
        break;
    }
  };

  // Set featured text
  const featuredTextQuery = query(doc(db, 'Featured-Texts', 'EventsPage'));
  const textSnapshot = getDoc(featuredTextQuery).then((textSnapshot) => {
    setFeaturedEventText(textSnapshot.data().Text);
    setDisplayFeaturedText(textSnapshot.data().display);
  });

  // open and close modals
  const handleCloseEventModal = () => setShowEventModal(false);
  const handleShowEventModal = (e) => {
    setEvent(e);
    setShowEventModal(true);
  };

  const handleCloseNewEventModal = () => setShowNewEventModal(false);
  const handleShowNewEventModal = () => setShowNewEventModal(true);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  // Set list of events
  useEffect(() => {
    const eventList = collection(db, 'Events');
    let eventsArray = [];
    const eventsSnapshot = getDocs(eventList).then((eventsSnapshot) => {
      eventsSnapshot.forEach((doc) => {
        let data = doc.data();
        eventsArray.push({
          description: data.description,
          end: data.end.toDate(),
          eventHost: data.eventHost,
          eventLink: data.eventLink,
          hostPhone: data.hostPhone,
          id: data.id,
          location: data.location,
          population: data.population,
          start: data.start.toDate(),
          tags: data.tags,
          title: data.title,
        });
      });
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    });
  }, []);

  // Set population filters list
  useEffect(() => {
    const populationFilterQuery = query(doc(db, 'Filters', 'Populations'));
    const populationsSnapshot = getDoc(populationFilterQuery).then(
      (populationsSnapshot) => {
        setPopulationFilters(populationsSnapshot.data().filters.sort());
      }
    );
  }, []);

  // Set tag filters list
  useEffect(() => {
    const tagsFilterQuery = query(doc(db, 'Filters', 'EventTags'));
    const tagsSnapshot = getDoc(tagsFilterQuery).then((tagsSnapshot) => {
      setTagFilters(tagsSnapshot.data().tags.sort());
    });
  }, []);

  return (
    <Fade in={open}>
      <Container className="events">
        <h2>Events</h2>
        {displayFeaturedText ? (
          <Row>
            <Col>
              <h4>Featured Events and Announcements</h4>
              {/* <div className="bg-secondary bg-opacity-50 border border-2 border-secondary rounded mb-2 pt-3 ps-3 pe-3">
                <p>{featuredEventText}</p>
              </div> */}
              <Alert variant="secondary">{featuredEventText}</Alert>
            </Col>
          </Row>
        ) : null}
        <h4>Event Calendar</h4>
        <Row className="mb-3">
          <Col md="auto">
            <h5 className="mt-2">Filter Events: </h5>
          </Col>
          {/* text search feature */}
          <Col md="4" className="p-2">
            <Form.Control
              type="text"
              className="text-filter-form"
              value={searchEventText.current}
              onChange={(e) => updateEventSearchText(e.target.value)}
              placeholder="Search Events by Name"
            />
          </Col>
          {/* Population filter */}
          <Col md="auto" className="p-2">
            <DropdownButton
              variant="secondary"
              id="population-filter-dropdown"
              title="Population"
              onSelect={(f) => updateEventPopFilter(f)}
            >
              {populationFilters.map((f) => (
                <Dropdown.Item eventKey={f}>{f}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Tag filter */}
          <Col md="auto" className="p-2">
            <DropdownButton
              variant="secondary"
              id="tag-filter-dropdown"
              title="Event Tag"
              onSelect={(f) => updateEventTagFilter(f)}
            >
              {tagFilters.map((t) => (
                <Dropdown.Item eventKey={t}>{t}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Show selected filters */}
          {eventPopFilter.current !== '' ? (
            <Col md="auto" className="p-2">
              <Button
                variant="outline-secondary"
                onClick={(e) => updateEventPopFilter('')}
              >
                {eventPopFilter.current} | X
              </Button>
            </Col>
          ) : null}
          {eventTagFilter.current !== '' ? (
            <Col md="auto" className="p-2">
              <Button
                variant="outline-secondary"
                onClick={(e) => updateEventTagFilter('')}
              >
                {eventTagFilter.current} | X
              </Button>
            </Col>
          ) : null}
        </Row>
        <Row className="event-calendar">
          <Col>
            <Calendar
              localizer={localizer}
              showMultiDayTimes
              events={filteredEvents}
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
            <Card.Text className="fw-semibold">
              Organizer: {event.eventHost}
              <br />
              Location: {event.location}
            </Card.Text>
            <Card.Text>{event.description}</Card.Text>
            {event.population !== '' ? (
              <>
                <h5>Populations:</h5>
                <ListGroup horizontal className="m-1">
                  <ListGroup.Item variant="secondary">
                    {event.population}
                  </ListGroup.Item>
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
              Share an Upcoming Event
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
            <NewEventForm handleCloseNewEventModal={handleCloseNewEventModal} handleShowSuccessModal={handleShowSuccessModal} />
          </Modal.Body>
          <Modal.Footer>
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
