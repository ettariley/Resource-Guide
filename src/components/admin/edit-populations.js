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
  deleteField,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';

function EditPopulations() {
  const [open, setOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState('');
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [populationsList, setPopulationsList] = useState([]);
  const [newPopulation, setNewPopulation] = useState('');
  const [newEditedPopulation, setNewEditedPopulation] = useState('');
  const trashPopulation = useRef('');

  const populationsListDB = doc(db, 'Filters', 'Populations');

  const handleCloseDeleteWarn = () => {
    setShowDeleteWarn(false);
    updateTrashPopulation('');
  };
  const handleShowDeleteWarn = (item) => {
    setShowDeleteWarn(true);
    updateTrashPopulation(item);
  };

  const handleSuccessToast = () => {
    window.scrollTo(0, 0);
    setShowSuccessToast(true);
  };

  const updateTrashPopulation = (p) => {
    trashPopulation.current = p;
  };

  const changeSuccess = () => {
    handleCloseDeleteWarn();
    handleSuccessToast();
  };

  const handleEdit = (item) => {
    setEditing(true);
    setEditingItem(item);
    setNewEditedPopulation(item);
    setNewPopulation('');
  };

  const resetEditing = () => {
    setEditing(false);
    setEditingItem('');
    setNewEditedPopulation('');
    setNewPopulation('');
  };

  const addNewPopulation = (pop) => {
    // add to database
    updateDoc(populationsListDB, {
      filters: arrayUnion(pop),
    }).then(() => {
      // add to useState list
      setPopulationsList([...populationsList, pop].sort());
    });
  };

  const addNewAndReset = (pop) => {
    // add to database and useState list
    addNewPopulation(pop);
    // clear text box
    resetEditing();
  };

  const updatePopulationList = (pop) => {
    const listItemToRemove = trashPopulation.current;
    // remove from database
    updateDoc(populationsListDB, {
      filters: arrayRemove(listItemToRemove),
    }).then(() => {
      updateDoc(populationsListDB, {
        filters: arrayUnion(pop),
      }).then(() => {
        // remove from useState list
        setPopulationsList(populationsList.filter((s) => s !== listItemToRemove));
        // add to useState list
        setPopulationsList([...populationsList, pop].sort());
      });
    });
  };

  const updateFutureEvents = () => {
    const oldItem = trashPopulation.current;
    // get event list
    const popQuery = query(
      collection(db, 'Events'),
      where('population', '==', oldItem),
      where('start', ">", new Date())
    );
    const querySnapshot = getDocs(popQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // update item
          updateDoc(doc.ref, {
            population: newEditedPopulation,
          }).then(() => {
            console.log('item updated');
          });
        });
      } else {
        console.log("no events to update");
      }
    });
  };

  const updateResources = () => {
    const oldItem = trashPopulation.current;
    // get resource list
    const resourceQuery = query(
      collection(db, 'Resources'),
      where('populationFilters', 'array-contains', oldItem)
    );
    const querySnapshot = getDocs(resourceQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // add new item
          updateDoc(doc.ref, {
            populationFilters: arrayUnion(newEditedPopulation),
          }).then(() => {
            console.log('item updated');
            // remove old item
            updateDoc(doc.ref, {
              populationFilters: arrayRemove(oldItem),
            }).then(() => {
              console.log('old item deleted');
            });
          });
        });
      } else {
        console.log("no resources to update");
      }
    });
  };

  const updatePopulationEverywhere = () => {
    setIsUpdating(true);
    // check for actual update
    if (editingItem !== newEditedPopulation) {  
      // update item functionality
      updateTrashPopulation(editingItem);
      updatePopulationList(newEditedPopulation);
      updateResources();
      updateFutureEvents();
      handleSuccessToast();
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    } else {
      setIsUpdating(false);
    }
    resetEditing();
    updateTrashPopulation('');
  };

  const deletePopulationFromList = () => {
    const listItemToRemove = trashPopulation.current;
    // remove from database
    updateDoc(populationsListDB, {
      filters: arrayRemove(listItemToRemove),
    }).then(() => {
      // remove from useState list
      setPopulationsList(
        populationsList.filter((p) => p !== trashPopulation.current)
      );
    });
  };

  const deleteFromFutureEvents = () => {
    // get event list
    const populationQuery = query(
      collection(db, 'Events'),
      where('population', '==', trashPopulation.current),
      where('start', ">", new Date())
    );
    const querySnapshot = getDocs(populationQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // remove from array
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            population: deleteField(),
          }).then(() => {
            console.log('item deleted');
            changeSuccess();
          });
        });
      } else {
        console.log("query empty");
        changeSuccess();
      }
    });
  };

  const deleteFromResource = () => {
    // get resource list
    const resourceQuery = query(
      collection(db, 'Resources'),
      where('populationFilters', 'array-contains', trashPopulation.current)
    );
    const querySnapshot = getDocs(resourceQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // remove from array
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            populationFilters: arrayRemove(trashPopulation.current),
          }).then(() => {
            console.log('item deleted');
            changeSuccess();
          });
        });
      } else {
        console.log("query empty");
        changeSuccess();
      }
    });
  };

  const deletePopulationEverywhere = () => {
    setIsUpdating(true);
    deletePopulationFromList();
    deleteFromResource();
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
    const populationFilterQuery = query(populationsListDB);
    const populationsSnapshot = getDoc(populationFilterQuery).then(
      (populationsSnapshot) => {
        setPopulationsList(populationsSnapshot.data().filters.sort());
      }
    );
  }, [populationsList]);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Edit Population Filters</h2>
        {/* Filters list*/}
        {isUpdating ? (
          <Col className='p-5'>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        ) : (
          <Row className="gx-5 gy-2">
          {populationsList.map((p) =>
            p === editingItem ? (
              // editing row
              <Col xs="12" sm="9" md="6" xl="4">
                <Row>
                  <Col xs="9" className="ps-0">
                    <Form.Control
                      type="text"
                      id="editPopulation"
                      value={newEditedPopulation}
                      onChange={(e) => setNewEditedPopulation(e.target.value)}
                      className="ps-3"
                    />
                  </Col>
                  <Col xs="3" className="d-flex text-center align-items-center">
                    <Button className="p-0 ms-1 list-buttons">
                      <i
                        className="bi bi-check-circle"
                        onClick={() => updatePopulationEverywhere()}
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
                  <Col>{p}</Col>
                  <Col
                    xs="3"
                    className="d-flex text-center align-items-center justify-content-evenly text-button-col"
                  >
                    <Button
                      className="p-0 list-buttons"
                      disabled={editing}
                      onClick={() => handleEdit(p)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button
                      className="p-0 list-buttons"
                      disabled={editing}
                      onClick={() => handleShowDeleteWarn(p)}
                    >
                      <i className="bi bi-trash3 text-danger list-delete"></i>
                    </Button>
                  </Col>
                </Row>
              </Col>
            )
          )}
          {/* add new population */}
          <Col xs="12" sm="9" md="6" xl="4">
            <Row>
              <Col xs="9">
                <Form.Control
                  type="text"
                  id="addPopulation"
                  placeholder="Add new population"
                  disabled={editing}
                  value={newPopulation}
                  onChange={(e) => setNewPopulation(e.target.value)}
                />
              </Col>
              <Col
                xs="3"
                className="d-flex align-items-center justify-content-evenly"
              >
                {newPopulation !== '' ? (
                  <>
                    <i
                      className="bi bi-plus-circle"
                      onClick={() => addNewAndReset(newPopulation)}
                    ></i>
                    <i
                      className="bi bi-x-circle"
                      onClick={() => setNewPopulation('')}
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
            <Modal.Title>Delete Population Filter</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            Are you sure you want to delete the "{trashPopulation.current}" population filter? It will be removed from any associated resources and events. This action
            cannot be undone.
          </Modal.Body>
          <Modal.Footer className="text-bg-light">
            <Button variant="secondary" onClick={handleCloseDeleteWarn}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deletePopulationEverywhere}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fade>
  );
}

export default EditPopulations;
