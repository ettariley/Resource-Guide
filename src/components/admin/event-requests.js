import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import {
  query,
  doc,
  collection,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EditResource from './edit-resource';
import EditEvent from './edit-event';
import AddEvent from './add-event';
import AddResource from './add-resource';

function EventRequests() {

  const [eventRequests, setEventRequests] = useState([]);
  const [filteredERequests, setFilteredERequests] = useState([]);
  const [selected, setSelected] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);

  const sortParam = useRef('');
  const filterParam = useRef('');
  const filterText = useRef('');
  
  const events = collection(db, 'Event-Requests');

  const handleCloseDeleteWarn = () => setShowDeleteWarn(false);
  const handleShowDeleteWarn = () => setShowDeleteWarn(true);

  useEffect(() => {
    const eventsQuery = query(events, orderBy('dateSubmitted', 'desc'));

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
    setFilteredERequests(eventsArray);
    sortParam.current = '';
  };

  const sortUnread = () => {
    const unreadEventsArray = [];
    const unreadQuery = query(events, orderBy('read'));
    const unreadQSnapshot = getDocs(unreadQuery).then((unreadQSnapshot) => {
      unreadQSnapshot.forEach((doc) => {
        let data = doc.data();
        unreadEventsArray.push({
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
      setEventRequests(unreadEventsArray);
      setFilteredERequests(unreadEventsArray);
      sortParam.current = 'Unread';
    });
  };

  const sortNewest = () => {
    const newestEventsArray = [];
    const newestQuery = query(events, orderBy('dateSubmitted', 'desc'));
    const newestQSnapshot = getDocs(newestQuery).then((newestQSnapshot) => {
      newestQSnapshot.forEach((doc) => {
        let data = doc.data();
        newestEventsArray.push({
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
      setEventRequests(newestEventsArray);
      setFilteredERequests(newestEventsArray);
      sortParam.current = 'Newest';
    });
  };

  const sortOldest = () => {
    const oldestEventsArray = [];
    const oldestQuery = query(events, orderBy('dateSubmitted'));
    const oldestQSnapshot = getDocs(oldestQuery).then((oldestQSnapshot) => {
      oldestQSnapshot.forEach((doc) => {
        let data = doc.data();
        oldestEventsArray.push({
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
      setEventRequests(oldestEventsArray);
      setFilteredERequests(oldestEventsArray);
      sortParam.current = 'Oldest';
    });
  };

  const sortTitle = () => {
    const titleEventsArray = [];
    const titleQuery = query(events, orderBy('title'));
    const titleQSnapshot = getDocs(titleQuery).then((titleQSnapshot) => {
      titleQSnapshot.forEach((doc) => {
        let data = doc.data();
        titleEventsArray.push({
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
      setEventRequests(titleEventsArray);
      setFilteredERequests(titleEventsArray);
      sortParam.current = 'Title';
    });
  };

  const updateFilterText = (value) => {
    filterText.current = value;
    filterRequests('title');
  };

  const filterRequests = (param) => {
    let filteredArray = [];
    switch (param) {
      case 'unread':
        filteredArray = eventRequests.filter((r) => !r.read);
        setFilteredERequests(filteredArray);
        filterParam.current = 'Unread';
        break;
      case 'read':
        filteredArray = eventRequests.filter((r) => r.read);
        setFilteredERequests(filteredArray);
        filterParam.current = 'Read';
        break;
      case 'title':
        filterParam.current = 'Title';
        filteredArray = eventRequests.filter((r) =>
          r.title.toLowerCase().includes(filterText.current.toLowerCase())
        );
        setFilteredERequests(filteredArray);
        break;
      case 'clear':
        filterParam.current = '';
        setFilteredERequests(eventRequests);
        break;
      default:
        break;
    }
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

  const markAsRead = () => {
    const eventDocReadRef = doc(events, selected.id);
    const readSnapshot = getDoc(eventDocReadRef).then(() => {
      if (!readSnapshot.read) {
        updateDoc(eventDocReadRef, {
          read: true,
        }).then(() => {
          setSelected((selected) => ({
            ...selected,
            read: true,
          }));
        });
      }
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
          className="sort-filter border border-secondary border-1"
        >
          <Row>
            <Col xs="6" className="border-end text-center d-flex justify-content-center">
              <DropdownButton
                variant="link"
                className=""
                id="dropdown-sort"
                title="Sort"
              >
                <Dropdown.Item onClick={() => sortUnread()}>Unread</Dropdown.Item>
                <Dropdown.Item onClick={() => sortNewest()}>
                  Date Submitted (Newest)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => sortOldest()}>
                  Date Submitted (Oldest)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => sortTitle()}>
                  Title
                </Dropdown.Item>
              </DropdownButton>
              {sortParam.current !== '' ? (
                <Badge bg="secondary" className="mt-2 mb-2 ms-1 me-1">
                  {sortParam.current}
                </Badge>
              ) : null}
            </Col>
            <Col xs="6" className="text-center d-flex justify-content-center">
              <DropdownButton
                variant="link"
                className=""
                id="dropdown-filter"
                title="Filter"
              >
                <Dropdown.Item onClick={() => filterRequests('unread')}>
                  Unread
                </Dropdown.Item>
                <Dropdown.Item onClick={() => filterRequests('read')}>
                  Read
                </Dropdown.Item>
                <Dropdown.Item onClick={() => filterRequests('title')}>
                  Title
                </Dropdown.Item>
              </DropdownButton>
              {filterParam.current !== '' ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="m-1"
                  onClick={() => filterRequests('clear')}
                >
                  {filterParam.current} | X
                </Button>
              ) : null}
            </Col>
          </Row>
          <Row>
            {filterParam.current === 'Title' ? (
                <Col className="p-1">
                  <Form.Control
                    type="text"
                    value={filterText.current}
                    onChange={(e) => updateFilterText(e.target.value)}
                    placeholder="Enter Event Title"
                  />
                </Col>
              ) : null} 
          </Row>
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
              <button className="btn btn-link" disabled={disabled} onClick={() => markAsRead()}>
                <Link to="/admin/add-event" state={{ selected: selected }}>Add New Event</Link>
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
            {filteredERequests.map((v) => (
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
            <div className='text-center text-muted pt-5'>
              <h3><i class="bi bi-envelope-open"></i></h3>
              <h3>No message selected</h3>
            </div>
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