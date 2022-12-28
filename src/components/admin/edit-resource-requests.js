import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
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
import { Link, useNavigate } from 'react-router-dom';
import EditResource from './edit-resource';
import EditEvent from './edit-event';
import AddEvent from './add-event';
import AddResource from './add-resource';

function EditResourceRequests() {
  const [editRequests, setEditRequests] = useState([]);
  const [selected, setSelected] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [active, setActive] = useState(false);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const edits = collection(db, 'Edit-Requests');
  const navigate = useNavigate();

  const handleCloseDeleteWarn = () => setShowDeleteWarn(false);
  const handleShowDeleteWarn = () => setShowDeleteWarn(true);

  // useEffect(() => {
  //   const edits = collection(db, 'Edit-Requests');
  //   const editsArray = [];
  //   const editsQuery = query(edits, orderBy('dateSubmitted'));
  //   const editsSnapshot = getDocs(editsQuery).then(
  //     (editsSnapshot) => {
  //       editsSnapshot.forEach((doc) => {
  //         let data = doc.data();
  //         editsArray.push({
  //           dateSubmitted: data.dateSubmitted.toDate(),
  //           editRequest: data.editRequest,
  //           id: data.id,
  //           identifier: data.identifier,
  //           phone: data.phone,
  //           provider: data.provider,
  //           read: data.read,
  //         });
  //       });
  //       setEditRequests(editsArray);
  //       console.log(editRequests);
  //     }
  //   );
  // }, [])

  useEffect(() => {
    const editsQuery = query(edits, orderBy('dateSubmitted'));

    const unsubscribe = onSnapshot(editsQuery, onEditsUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const onEditsUpdate = (editsSnapshot) => {
    const editsArray = [];
    editsSnapshot.forEach((doc) => {
      let data = doc.data();
      editsArray.push({
        dateSubmitted: data.dateSubmitted.toDate(),
        editRequest: data.editRequest,
        // _id: data._id,
        id: doc.id,
        identifier: data.identifier,
        phone: data.phone,
        provider: data.provider,
        read: data.read,
      });
    });
    setEditRequests(editsArray);
  };

  const handleSelectDisabled = (r) => {
    setDisabled(false);
    setSelected(r);
  };

  const toggleRead = () => {
    const editDocReadRef = doc(edits, selected.id);
    updateDoc(editDocReadRef, {
      read: !selected.read,
    }).then(() => {
      setSelected((selected) => ({
        ...selected,
        read: !selected.read,
      }));
    });
  };

  // const navEditResource = () => {
  //   // navigate('admin/edit-resource');
  //   <EditResource selected={selected} />
  // };

  const handleDeleteRequest = () => {
    const editDocReadRef = doc(edits, selected.id);
    deleteDoc(editDocReadRef).then(() => {
      setSelected((selected) => ({}));
      handleCloseDeleteWarn();
    });
  };

  return (
    <Container className="mt-5 pt-5 pb-4">
      <h2>Edit Resource Requests</h2>
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
                <Link to="/admin/edit-resource">Edit Resource</Link>
              </button>
              {/* <button className='btn btn-link' disabled={disabled} onClick={() => navEditResource()}>Edit Resource</button> */}
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
        <Col sm="4" className="border border-secondary border-1 p-0">
          <ListGroup
            variant="flush"
            activeKey={selected.id}
          >
            {editRequests.map((r) => (
              <ListGroup.Item
                action
                eventKey={r.id}
                variant="primary"
                onClick={() => handleSelectDisabled(r)}
              >
                {!r.read ? (
                  <b>
                    <p className="mb-0">Edit Request: {r.provider}</p>
                    <p className="mb-0" style={{ fontSize: '0.875em' }}>
                      {r.dateSubmitted.toDateString()}
                    </p>
                  </b>
                ) : (
                  <>
                    <p className="mb-0">Edit Request: {r.provider}</p>
                    <p className="mb-0" style={{ fontSize: '0.875em' }}>
                      {r.dateSubmitted.toDateString()}
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
              <h5 className="pt-2">Edit Request: {selected.provider}</h5>
              <p>Person Submitting is: {selected.identifier}</p>
              <p>Phone: {selected.phone}</p>
              <p>Edit Requested: {selected.editRequest}</p>
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
          Are you sure you want to delete this edit request? This action cannot
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

export default EditResourceRequests;
