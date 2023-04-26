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

function EditServices() {
  const [open, setOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState('');
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [servicesList, setServicesList] = useState([]);
  const [newService, setNewService] = useState('');
  const [newEditedService, setNewEditedService] = useState('');
  const trashService = useRef('');

  const servicesListDB = doc(db, 'Filters', 'Programs');

  const handleCloseDeleteWarn = () => {
    setShowDeleteWarn(false);
    updateTrashService('');
  };
  const handleShowDeleteWarn = (item) => {
    setShowDeleteWarn(true);
    updateTrashService(item);
  };

  const handleSuccessToast = () => {
    window.scrollTo(0, 0);
    setShowSuccessToast(true);
  };

  const updateTrashService = (t) => {
    trashService.current = t;
  };

  const changeSuccess = () => {
    handleCloseDeleteWarn();
    handleSuccessToast();
  };

  const handleEdit = (item) => {
    setEditing(true);
    setEditingItem(item);
    setNewEditedService(item);
    setNewService('');
  };

  const resetEditing = () => {
    setEditing(false);
    setEditingItem('');
    setNewEditedService('');
    setNewService('');
  };

  const deleteFromResource = () => {
    // get resource list
    const resourceQuery = query(
      collection(db, 'Resources'),
      where('serviceFilters', 'array-contains', trashService.current)
    );
    const querySnapshot = getDocs(resourceQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // remove from array
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, {
            serviceFilters: arrayRemove(trashService.current),
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

  const updateResources = () => {
    const oldItem = trashService.current;
    // get resource list
    const resourceQuery = query(
      collection(db, 'Resources'),
      where('serviceFilters', 'array-contains', oldItem)
    );
    const querySnapshot = getDocs(resourceQuery).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // add new item
          updateDoc(doc.ref, {
            serviceFilters: arrayUnion(newEditedService),
          }).then(() => {
            console.log('item updated');
            // remove old item
            updateDoc(doc.ref, {
              serviceFilters: arrayRemove(oldItem),
            }).then(() => {
              console.log('old item deleted');
            });
          });
        });
      } else {
        console.log('no resources to update');
      }
    });
  };

  const addNewService = (service) => {
    // add to database
    updateDoc(servicesListDB, {
      filters: arrayUnion(service),
    }).then(() => {
      // add to useState list
      setServicesList([...servicesList, service].sort());
    });
  };

  const addNewAndReset = (service) => {
    // add to database and useState list
    addNewService(service);
    // clear text box
    resetEditing();
  };

  const updateServiceList = (service) => {
    const listItemToRemove = trashService.current;
    // remove from database
    updateDoc(servicesListDB, {
      filters: arrayRemove(listItemToRemove),
    }).then(() => {
      updateDoc(servicesListDB, {
        filters: arrayUnion(service),
      }).then(() => {
        // remove from useState list
        setServicesList(servicesList.filter((s) => s !== listItemToRemove));
        // add to useState list
        setServicesList([...servicesList, service].sort());
      });
    });
  };

  const deleteServiceFromList = () => {
    const listItemToRemove = trashService.current;
    updateDoc(servicesListDB, {
      filters: arrayRemove(listItemToRemove),
    }).then(() => {
      // remove from useState list
      setServicesList(servicesList.filter((s) => s !== listItemToRemove));
    });
  };

  const deleteItemEverywhere = () => {
    setIsUpdating(true);
    deleteServiceFromList();
    deleteFromResource();
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  const updateItemEverywhere = () => {
    setIsUpdating(true);
    // check for actual update
    if (editingItem !== newEditedService) {
      // update item functionality
      updateTrashService(editingItem);
      updateServiceList(newEditedService);
      updateResources();
      handleSuccessToast();
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    } else {
      setIsUpdating(false);
    }
    resetEditing();
    updateTrashService('');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const serviceFilterQuery = query(servicesListDB);
    const servicesSnapshot = getDoc(serviceFilterQuery).then(
      (servicesSnapshot) => {
        setServicesList(servicesSnapshot.data().filters.sort());
      }
    );
  }, [servicesList]);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Edit Service Filters</h2>
        {/* Filters list*/}
        {isUpdating ? (
          <Col className="p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        ) : (
          <Row className="gx-5 gy-2">
            {servicesList.map((p) =>
              p === editingItem ? (
                // editing row
                <Col xs="12" sm="9" md="6" xl="4">
                  <Row>
                    <Col xs="9" className="ps-0">
                      <Form.Control
                        type="text"
                        id="editService"
                        value={newEditedService}
                        onChange={(e) => setNewEditedService(e.target.value)}
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
                          onClick={() => updateItemEverywhere()}
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
            {/* add new service */}
            <Col xs="12" sm="9" md="6" xl="4">
              <Row>
                <Col xs="9">
                  <Form.Control
                    type="text"
                    id="addService"
                    placeholder="Add new service"
                    disabled={editing}
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                  />
                </Col>
                <Col
                  xs="3"
                  className="d-flex align-items-center justify-content-evenly"
                >
                  {newService !== '' ? (
                    <>
                      <i
                        className="bi bi-plus-circle"
                        onClick={() => addNewAndReset(newService)}
                      ></i>
                      <i
                        className="bi bi-x-circle"
                        onClick={() => setNewService('')}
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
            <Modal.Title>Delete Service Filter</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            Are you sure you want to delete the "{trashService.current}" service
            filter? It will be removed from any associated resources. This
            action cannot be undone.
          </Modal.Body>
          <Modal.Footer className="text-bg-light">
            <Button variant="secondary" onClick={handleCloseDeleteWarn}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteItemEverywhere}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fade>
  );
}

export default EditServices;
