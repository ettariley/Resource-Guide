import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import {
  query,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
  getDocs,
  collection,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';

function EditTags() {
  const [open, setOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState('');
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [tagsList, setTagsList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newEditedTag, setNewEditedTag] = useState('');
  const trashTag = useRef('');

  const tagsListDB = doc(db, 'Filters', 'EventTags');

  const handleCloseDeleteWarn = () => {
    setShowDeleteWarn(false);
    updateTrashTag('');
  };
  const handleShowDeleteWarn = (item) => {
    setShowDeleteWarn(true);
    updateTrashTag(item);
  };

  const handleSuccessToast = () => {
    window.scrollTo(0, 0);
    setShowSuccessToast(true);
  };

  const updateTrashTag = (t) => {
    trashTag.current = t;
  };

  const changeSuccess = () => {
    handleCloseDeleteWarn();
    handleSuccessToast();
  };

  const handleEdit = (item) => {
    setEditing(true);
    setEditingItem(item);
    setNewEditedTag(item);
    setNewTag('');
  };

  const resetEditing = () => {
    setEditing(false);
    setEditingItem('');
    setNewEditedTag('');
    setNewTag('');
  };

  const addNewTag = (tag) => {
    // add to database
    updateDoc(tagsListDB, {
      tags: arrayUnion(tag),
    }).then(() => {
      // add to useState list
      setTagsList([...tagsList, tag].sort());
    });
  };

  const addNewAndReset = (tag) => {
    // add to database and useState list
    addNewTag(tag);
    // clear text box
    resetEditing();
  };

  const updateTagList = (tag) => {
    const tagToRemove = trashTag.current;
    // remove from database
    updateDoc(tagsListDB, {
      tags: arrayRemove(tagToRemove),
    }).then(() => {
      updateDoc(tagsListDB, {
        tags: arrayUnion(tag),
      }).then(() => {
        // remove from useState list
        setTagsList(tagsList.filter((t) => t !== tagToRemove));
        // add to useState list
        setTagsList([...tagsList, tag].sort());
      });
    });
  };

  const updateFutureEvents = () => {
    const oldItem = trashTag.current;
    // get event list
    const tagQuery = query(
      collection(db, 'Events'),
      where('tags', 'array-contains', oldItem),
      where('start', '>', new Date())
    );
    const querySnapshot = getDocs(tagQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // add new item
          updateDoc(doc.ref, {
            tags: arrayUnion(newEditedTag),
          }).then(() => {
            console.log('item updated');
            // remove old item
            updateDoc(doc.ref, {
              tags: arrayRemove(oldItem),
            }).then(() => {
              console.log('old item deleted');
            });
          });
        });
      } else {
        console.log('no events to update');
      }
    });
  };

  const updateTagEverywhere = () => {
    setIsUpdating(true);
    // check for actual update
    if (editingItem !== newEditedTag) {
      // update item functionality
      updateTrashTag(editingItem);
      updateTagList(newEditedTag);
      updateFutureEvents();
      handleSuccessToast();
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    } else {
      setIsUpdating(false);
    }
    resetEditing();
    updateTrashTag('');
  };

  const deleteTagFromList = () => {
    const tagToRemove = trashTag.current;
    // remove from database
    updateDoc(tagsListDB, {
      tags: arrayRemove(tagToRemove),
    }).then(() => {
      // remove from useState list
      setTagsList(tagsList.filter((t) => t !== tagToRemove));
    });
  };

  const deleteFromFutureEvents = () => {
    // get event list
    const tagQuery = query(
      collection(db, 'Events'),
      where('tags', 'array-contains', trashTag.current),
      where('start', '>', new Date())
    );
    const querySnapshot = getDocs(tagQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // remove from array
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            tags: arrayRemove(trashTag.current),
          }).then(() => {
            console.log('item deleted');
            changeSuccess();
          });
        });
      } else {
        console.log('query empty');
        changeSuccess();
      }
    });
  };

  const deleteTagEverywhere = () => {
    setIsUpdating(true);
    deleteTagFromList();
    deleteFromFutureEvents();
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const tagFilterQuery = query(tagsListDB);
    const tagsSnapshot = getDoc(tagFilterQuery).then((tagsSnapshot) => {
      setTagsList(tagsSnapshot.data().tags.sort());
    });
  }, [tagsList]);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Edit Event Tags</h2>
        {/* Filters list*/}
        {isUpdating ? (
          <Col className="p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        ) : (
          <Row className="gx-5 gy-2">
            {tagsList.map((t) =>
              t === editingItem ? (
                // editing row
                <Col xs="12" sm="9" md="6" xl="4">
                  <Row>
                    <Col xs="9" className="ps-0">
                      <Form.Control
                        type="text"
                        id="editTag"
                        value={newEditedTag}
                        onChange={(e) => setNewEditedTag(e.target.value)}
                        className="ps-3"
                      />
                    </Col>
                    <Col
                      xs="3"
                      className="d-flex text-center align-items-center"
                    >
                      <Button className="p-0 ms-1 list-buttons">
                        <i
                          className="bi bi-check-circle"
                          onClick={() => updateTagEverywhere()}
                        ></i>
                      </Button>
                      <Button className="p-0 ms-2 list-buttons">
                        <i
                          className="bi bi-x-circle"
                          onClick={() => resetEditing()}
                        ></i>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              ) : (
                // text rows
                <Col xs="12" sm="9" md="6" xl="4">
                  <Row className="p-2 rounded-4 list-rows shadow-sm">
                    <Col>{t}</Col>
                    <Col
                      xs="3"
                      className="d-flex text-center align-items-center justify-content-evenly text-button-col"
                    >
                      <Button
                        className="p-0 list-buttons"
                        disabled={editing}
                        onClick={() => handleEdit(t)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        className="p-0 list-buttons"
                        disabled={editing}
                        onClick={() => handleShowDeleteWarn(t)}
                      >
                        <i className="bi bi-trash3 text-danger list-delete"></i>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              )
            )}
            {/* add new service */}
            <Col xs="12" sm="9" md="6" xl="4">
              <Row>
                <Col xs="9">
                  <Form.Control
                    type="text"
                    id="addTag"
                    placeholder="Add new service"
                    disabled={editing}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                </Col>
                <Col
                  xs="3"
                  className="d-flex align-items-center justify-content-evenly"
                >
                  {newTag !== '' ? (
                    <>
                      <i
                        className="bi bi-plus-circle"
                        onClick={() => addNewAndReset(newTag)}
                      ></i>
                      <i
                        className="bi bi-x-circle"
                        onClick={() => setNewTag('')}
                      ></i>
                    </>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        {/* Return to admin dashboard button */}
        <Row className="mt-4 mb-2">
          <Col className="ps-0">
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
            <Toast.Body>
              Your edits were saved. All affected resources and future events
              are updated.
            </Toast.Body>
          </Toast>
        </ToastContainer>
        {/* Delete Warn Modal */}
        <Modal show={showDeleteWarn} onHide={handleCloseDeleteWarn}>
          <Modal.Header className="text-bg-light" closeButton>
            <Modal.Title>Delete Event Tag</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            Are you sure you want to delete the "{trashTag.current}" event tag?
            It will be removed from any associated events. This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer className="text-bg-light">
            <Button variant="secondary" onClick={handleCloseDeleteWarn}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteTagEverywhere}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fade>
  );
}

export default EditTags;
