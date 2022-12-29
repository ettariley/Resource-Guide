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
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import EditResource from './edit-resource';
import EditEvent from './edit-event';
import AddEvent from './add-event';
import AddResource from './add-resource';

function ResourceRequests() {
  const [resourceRequests, setResourceRequests] = useState([]);
  const [selected, setSelected] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [active, setActive] = useState(false);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const sortParam = useRef('');
  const resources = collection(db, 'Resource-Requests');
  const navigate = useNavigate();

  const handleCloseDeleteWarn = () => setShowDeleteWarn(false);
  const handleShowDeleteWarn = () => setShowDeleteWarn(true);

  useEffect(() => {
    const resourcesQuery = query(resources, orderBy('dateSubmitted', 'desc'));

    const unsubscribe = onSnapshot(resourcesQuery, onResourcesUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const onResourcesUpdate = (resourcesSnapshot) => {
    const resourcesArray = [];
    resourcesSnapshot.forEach((doc) => {
      let data = doc.data();
      resourcesArray.push({
        dateSubmitted: data.dateSubmitted.toDate(),
        description: data.description,
        website: data.website || 'Not Provided',
        phone: data.phone || 'Not Provided',
        address: data.address,
        read: data.read,
        provider: data.provider,
        id: doc.id,
        identifier: data.identifier,
      });
    });
    setResourceRequests(resourcesArray);
  };

  const sortUnread = () => {
    const unreadResourcesArray = [];
    const unreadQuery = query(resources, orderBy('read'));
    const unreadQSnapshot = getDocs(unreadQuery).then((unreadQSnapshot) => {
      unreadQSnapshot.forEach((doc) => {
        let data = doc.data();
        unreadResourcesArray.push({
          dateSubmitted: data.dateSubmitted.toDate(),
          description: data.description,
          website: data.website || 'Not Provided',
          phone: data.phone || 'Not Provided',
          address: data.address,
          read: data.read,
          provider: data.provider,
          id: doc.id,
          identifier: data.identifier,
        });
      });
      setResourceRequests(unreadResourcesArray);
      sortParam.current = 'Unread';
    });
  };

  const sortNewest = () => {
    const newestResourcesArray = [];
    const newestQuery = query(resources, orderBy('dateSubmitted', 'desc'));
    const newestQSnapshot = getDocs(newestQuery).then((newestQSnapshot) => {
      newestQSnapshot.forEach((doc) => {
        let data = doc.data();
        newestResourcesArray.push({
          dateSubmitted: data.dateSubmitted.toDate(),
          description: data.description,
          website: data.website || 'Not Provided',
          phone: data.phone || 'Not Provided',
          address: data.address,
          read: data.read,
          provider: data.provider,
          id: doc.id,
          identifier: data.identifier,
        });
      });
      setResourceRequests(newestResourcesArray);
      sortParam.current = 'Newest';
    });
  };

  const sortOldest = () => {
    const oldestResourcesArray = [];
    const oldestQuery = query(resources, orderBy('dateSubmitted'));
    const oldestQSnapshot = getDocs(oldestQuery).then((oldestQSnapshot) => {
      oldestQSnapshot.forEach((doc) => {
        let data = doc.data();
        oldestResourcesArray.push({
          dateSubmitted: data.dateSubmitted.toDate(),
          description: data.description,
          website: data.website || 'Not Provided',
          phone: data.phone || 'Not Provided',
          address: data.address,
          read: data.read,
          provider: data.provider,
          id: doc.id,
          identifier: data.identifier,
        });
      });
      setResourceRequests(oldestResourcesArray);
      sortParam.current = 'Oldest';
    });
  };

  const sortProvider = () => {
    const providerResourcesArray = [];
    const providerQuery = query(resources, orderBy('provider'));
    const providerQSnapshot = getDocs(providerQuery).then(
      (providerQSnapshot) => {
        providerQSnapshot.forEach((doc) => {
          let data = doc.data();
          providerResourcesArray.push({
            dateSubmitted: data.dateSubmitted.toDate(),
            description: data.description,
            website: data.website || 'Not Provided',
            phone: data.phone || 'Not Provided',
            address: data.address,
            read: data.read,
            provider: data.provider,
            id: doc.id,
            identifier: data.identifier,
          });
        });
        setResourceRequests(providerResourcesArray);
        sortParam.current = 'Provider';
      }
    );
  };

  const handleSelectDisabled = (r) => {
    setDisabled(false);
    setSelected(r);
  };

  const toggleRead = () => {
    const resourceDocReadRef = doc(resources, selected.id);
    updateDoc(resourceDocReadRef, {
      read: !selected.read,
    }).then(() => {
      setSelected((selected) => ({
        ...selected,
        read: !selected.read,
      }));
    });
  };

  const handleDeleteRequest = () => {
    const resourceDocReadRef = doc(resources, selected.id);
    deleteDoc(resourceDocReadRef).then(() => {
      setSelected((selected) => ({}));
      handleCloseDeleteWarn();
    });
  };

  return (
    <Container className="mt-5 pt-5 pb-4">
      <h2>New Resource Requests</h2>
      <Row>
        <Col sm="4" className="sort-filter border border-1 d-flex p-0">
          <Col
            xs="6"
            className="border-end text-center d-flex justify-content-center"
          >
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
              <Dropdown.Item onClick={() => sortProvider()}>
                Provider
              </Dropdown.Item>
            </DropdownButton>
            {sortParam.current !== '' ? (
              <Badge bg="secondary" className="mt-2 mb-2 ms-1 me-1">
                {sortParam.current}
              </Badge>
            ) : null}
          </Col>
          <Col xs="6" className="text-center">
            <DropdownButton
              variant="link"
              className=""
              id="dropdown-filter"
              title="Filter"
            >
              <Dropdown.Item>Unread</Dropdown.Item>
              <Dropdown.Item>Read</Dropdown.Item>
              <Dropdown.Item>Provider</Dropdown.Item>
            </DropdownButton>
          </Col>
        </Col>
        <Col sm="8" className="edit-selected border border-1 text-center">
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
                <Link to="/admin/add-resource">Add New Resource</Link>
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
        <Col sm="4" className="requests-list-col border border-1 p-0">
          <ListGroup
            variant="flush"
            activeKey={selected.id}
            // key={resourceRequests.id}
            // className=""
          >
            {resourceRequests.map((r) => (
              <ListGroup.Item
                action
                eventKey={r.id}
                variant="primary"
                onClick={() => handleSelectDisabled(r)}
              >
                {!r.read ? (
                  <b>
                    <p className="mb-0">New Resource: {r.provider}</p>
                    <p className="mb-0" style={{ fontSize: '0.875em' }}>
                      {r.dateSubmitted.toDateString()}
                    </p>
                  </b>
                ) : (
                  <>
                    <p className="mb-0">New Resource: {r.provider}</p>
                    <p className="mb-0" style={{ fontSize: '0.875em' }}>
                      {r.dateSubmitted.toDateString()}
                    </p>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col sm="8" className="request-body border border-1">
          {selected.id ? (
            <>
              <h5 className="pt-2">New Resource: {selected.provider}</h5>
              <p>Person Submitting is: {selected.identifier}</p>
              <p>Address: {selected.address}</p>
              <p>Description: {selected.description}</p>
              <p>Provider Phone: {selected.phone}</p>
              <p>Provider Site: {selected.website}</p>
            </>
          ) : (
            <div className="text-center text-muted pt-5">
              <h3>
                <i class="bi bi-envelope-open"></i>
              </h3>
              <h3>No message selected</h3>
            </div>
          )}
        </Col>
      </Row>
      {/* Return to admin dashboard button */}
      <Row className="mt-5">
        <Col className="ps-0">
          <Button variant="outline-light" size="sm" as={Link} to="/admin">
            <i class="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>

      <Modal show={showDeleteWarn} onHide={handleCloseDeleteWarn}>
        <Modal.Header className="text-bg-light" closeButton>
          <Modal.Title>Delete Resource Request</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          Are you sure you want to delete this resource request? This action
          cannot be undone.
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

export default ResourceRequests;
