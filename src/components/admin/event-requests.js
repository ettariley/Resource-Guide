import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import {
  query,
  doc,
  collection,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import EditResource from './edit-resource';
import EditEvent from './edit-event';
import AddEvent from './add-event';
import AddResource from './add-resource';

function EventRequests() {

  const [eventRequests, setEventRequests] = useState([]);
  const [selected, setSelected] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [active, setActive] = useState(false);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const events = collection(db, 'Event-Requests');
  const navigate = useNavigate();

  const handleCloseDeleteWarn = () => setShowDeleteWarn(false);
  const handleShowDeleteWarn = () => setShowDeleteWarn(true);

  useEffect(() => {
    const eventsQuery = query(events, orderBy('dateSubmitted'));

    const unsubscribe = onSnapshot(eventsQuery, onEventsUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const onEventsUpdate = (eventsSnapshot) => {
    const eventsArray = [];
    eventsSnapshot.forEach((doc) => {
      let data = doc.data();
      eventsArray.push({
        dateSubmitted: data.dateSubmitted.toDate(),
        description: data.description,
        end: data.end.toDate(),
        eventHost: data.eventHost,
        eventLink: data.eventLink || "Not Provided",
        hostPhone: data.hostPhone || "Not Provided",
        location: data.location,
        read: data.read,
        start: data.start.toDate(),
        title: data.title,
        id: doc.id,
        identifier: data.identifier,
      });
    });
    setEventRequests(eventsArray);
  };

  const handleSelectDisabled = (v) => {
    setDisabled(false);
    setSelected(v);
  };

  const toggleRead = () => {
    const eventDocReadRef = doc(events, selected.id);
    updateDoc(eventDocReadRef, {
      read: !selected.read,
    }).then(() => {
      setSelected((selected) => ({
        ...selected,
        read: !selected.read,
      }));
    });
  };

  const handleDeleteRequest = () => {
    const eventDocReadRef = doc(events, selected.id);
    deleteDoc(eventDocReadRef).then(() => {
      setSelected((selected) => ({}));
      handleCloseDeleteWarn();
    });
  };

  return (
    <Container className="mt-5 pt-5 pb-4">
      <h2>New Event Requests</h2>
      <Row>
        <Col
          sm="4"
          className="sort-filter border border-secondary border-1 d-flex p-0"
        >
          <Col xs="6" className="border-end text-center">
            <DropdownButton
              variant="link"
              className=""
              id="dropdown-sort"
              title="Sort"
            >
              <Dropdown.Item href="#/action-1">Unread</Dropdown.Item>
              <Dropdown.Item href="#/action-2">
                Date Submitted (Newest)
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Date Submitted (Oldest)
              </Dropdown.Item>
              <Dropdown.Item href="#/action-4">Subject</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs="6" className="text-center">
            <DropdownButton
              variant="link"
              className=""
              id="dropdown-filter"
              title="Filter"
            >
              <Dropdown.Item href="#/action-1">Unread</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Read</Dropdown.Item>
            </DropdownButton>
          </Col>
        </Col>
        <Col
          sm="8"
          className="edit-selected border border-secondary border-1 text-center"
        >
          <Row xs={3}>
            <Col>
              <button
                className="btn btn-link"
                onClick={toggleRead}
                disabled={disabled}
              >
                {selected.read ? <>Mark as Unread</> : <>Mark as Read</>}
              </button>
            </Col>
            <Col className="border-start border-end">
              <button className="btn btn-link" disabled={disabled}>
                <Link to="/admin/add-event">Add New Event</Link>
              </button>
            </Col>
            <Col>
              <button
                className="btn btn-link"
                disabled={disabled}
                onClick={handleShowDeleteWarn}
              >
                Delete
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col sm="4" className="requests-list-col border border-secondary border-1 p-0">
          <ListGroup
            variant="flush"
            activeKey={selected.id}
          >
            {eventRequests.map((v) => (
              <ListGroup.Item
                action
                eventKey={v.id}
                variant="primary"
                onClick={() => handleSelectDisabled(v)}
              >
                {!v.read ? (
                  <b>
                    <p className="mb-0">New Event: {v.title}</p>
                    <p className="mb-0" style={{ fontSize: '0.875em' }}>
                      {v.dateSubmitted.toDateString()}
                    </p>
                  </b>
                ) : (
                  <>
                    <p className="mb-0">New Event: {v.title}</p>
                    <p className="mb-0" style={{ fontSize: '0.875em' }}>
                      {v.dateSubmitted.toDateString()}
                    </p>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col sm="8" className="request-body border border-secondary border-1">
          {selected.id ? (
            <>
              <h5 className="pt-2">New Event: {selected.title}</h5>
              <p>Event Host: {selected.eventHost}</p>
              <p>Person Submitting is: {selected.identifier}</p>
              <p>Start Time: {selected.start.toDateString()}</p>
              <p>End Time: {selected.end.toDateString()}</p>
              <p>Location: {selected.location}</p>
              <p>Description: {selected.description}</p>
              <p>Host Contact: {selected.hostPhone}</p>
              <p>Event Link: {selected.eventLink}</p>
            </>
          ) : (
            <p>No message selected</p>
          )}
        </Col>
      </Row>
      {/* Return to admin dashboard button */}
      <Row className='mt-5'>
        <Col className='ps-0'>
          <Button variant="outline-light" size='sm' as={Link} to="/admin">
            <i class="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
      
      <Modal show={showDeleteWarn} onHide={handleCloseDeleteWarn}>
        <Modal.Header className="text-bg-light" closeButton>
          <Modal.Title>Delete Edit Request</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          Are you sure you want to delete this event request? This action cannot
          be undone.
        </Modal.Body>
        <Modal.Footer className="text-bg-light">
          <Button variant="secondary" onClick={handleCloseDeleteWarn}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteRequest}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EventRequests;