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
import { Link, useLocation } from 'react-router-dom';
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
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';

function EditResource() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDeleteWarn, setShowDeleteWarn] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [resource, setResource] = useState({});
  const [programFilters, setProgramFilters] = useState([]);
  const [populationFilters, setPopulationFilters] = useState([]);
  const [resourcePopulations, setResourcePopulations] = useState([]);
  const [resourcePrograms, setResourcePrograms] = useState([]);
  const [resourceProvider, setResourceProvider] = useState('');
  const [resourceAddress, setResourceAddress] = useState('');
  const [resourcePhone, setResourcePhone] = useState('');
  const [resourceWebsite, setResourceWebsite] = useState('');
  const [resourceEmail, setResourceEmail] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const selected = location.state?.selected;
  const requestInfo = useRef(Object.keys(selected).length);

  const searchText = useRef('');
  const searchLength = useRef(-1);
  const characters = useRef(0);

  const resources = collection(db, 'Resources');

  const handleCloseDeleteWarn = () => setShowDeleteWarn(false);
  const handleShowDeleteWarn = () => setShowDeleteWarn(true);

  const updateSearchText = (value) => {
    searchText.current = value;
  };

  const searchResources = () => {
    const resourcesQuery = query(
      resources,
      where('provider', '==', searchText.current),
      limit(1)
    );
    let resourcesArray = [];
    const resourcesQSnapshot = getDocs(resourcesQuery).then(
      (resourcesQSnapshot) => {
        resourcesQSnapshot.forEach((doc) => {
          let data = doc.data();
          resourcesArray.push({
            address: data.address,
            description: data.description,
            email: data.email,
            id: doc.id,
            phone: data.phone,
            populationFilters: data.populationFilters,
            provider: data.provider,
            serviceFilters: data.serviceFilters,
            website: data.website,
          });
        });
        setResource(resourcesArray[0]);
        searchLength.current = Object.keys(resourcesArray).length;
        characters.current = resource.description.length;
      }
    );
  };

  const editResource = (resource) => {
    setResourceAddress(resource.address);
    setResourceDescription(resource.description);
    setResourcePhone(resource.phone);
    setResourcePopulations(resource.populationFilters);
    setResourceProvider(resource.provider);
    setResourcePrograms(resource.serviceFilters);
    setResourceWebsite(resource.website);
    setResourceEmail(resource.email);
    setReadOnly(false);
  };

  const cancelEdits = () => {
    setReadOnly(true);
    setErrors({});
    setResourceAddress('');
    setResourceDescription('');
    setResourcePhone('');
    setResourcePopulations([]);
    setResourceProvider('');
    setResourcePrograms([]);
    setResourceWebsite('');
    setResourceEmail('');
  };

  const updateReadOnly = () => {
    setResource({
      ...resource,
      description: resourceDescription,
      phone: resourcePhone,
      provider: resourceProvider,
      address: resourceAddress,
      website: resourceWebsite || null,
      email: resourceEmail || null,
      populationFilters: resourcePopulations || null,
      serviceFilters: resourcePrograms,
    });
  };

  const onResourceChange = (type, value) => {
    switch (type) {
      case 'provider':
        setResourceProvider(value);
        if (!errors[resourceProvider])
          setErrors({ ...errors, resourceProvider: null });
        break;
      case 'address':
        setResourceAddress(value);
        if (!errors[resourceAddress])
          setErrors({ ...errors, resourceAddress: null });
        break;
      case 'phone':
        setResourcePhone(value);
        if (!errors[resourcePhone])
          setErrors({ ...errors, resourcePhone: null });
        break;
      case 'website':
        setResourceWebsite(value);
        if (!errors[resourceWebsite])
          setErrors({ ...errors, resourceWebsite: null });
        break;
      case 'email':
        setResourceEmail(value);
        if (!errors[resourceEmail])
          setErrors({ ...errors, resourceEmail: null });
        break;
      case 'description':
        setResourceDescription(value);
        characters.current = value.length;
        if (!errors[resourceDescription])
          setErrors({ ...errors, resourceDescription: null });
        break;
      case 'populations':
        if (!resourcePopulations.includes(value)) {
          setResourcePopulations([...resourcePopulations, value]);
        } else {
          setResourcePopulations(
            resourcePopulations.filter((r) => r !== value)
          );
        }
        if (!errors[resourcePopulations])
          setErrors({ ...errors, resourcePopulations: null });
        break;
      case 'programs':
        if (!resourcePrograms.includes(value)) {
          setResourcePrograms([...resourcePrograms, value]);
        } else {
          setResourcePrograms(resourcePrograms.filter((r) => r !== value));
        }
        if (!errors[resourcePrograms])
          setErrors({ ...errors, resourcePrograms: null });
        break;
      default:
        break;
    }
  };

  const findFormErrors = () => {
    const newErrors = {};
    const phoneno = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const site =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!resourceProvider || resourceProvider === '') {
      newErrors.resourceProvider = 'Required';
    }
    if (!resourceAddress || resourceAddress === '') {
      newErrors.resourceAddress = 'Required';
    }
    if (!resourcePhone || resourcePhone === '') {
      newErrors.resourcePhone = 'Required';
    } else if (resourcePhone !== '' && !phoneno.test(resourcePhone)) {
      newErrors.resourcePhone =
        'Phone number should be in 123-456-7890 format.';
    }
    if (!resourceDescription || resourceDescription === '') {
      newErrors.resourceDescription = 'Required';
    } else if (resourceDescription.length > 250) {
      newErrors.resourceDescription =
        'Descriptions should be less than 250 characters.';
    }
    if (resourcePrograms === [] || resourcePrograms.length === 0) {
      newErrors.resourcePrograms = 'You must select at least one program.';
    }
    if (resourceWebsite !== '' && !site.test(resourceWebsite)) {
      newErrors.resourceWebsite = 'Please enter a valid URL.';
    }
    if (resourceEmail !== '' && !email.test(resourceEmail)) {
      newErrors.resourceEmail = 'Please enter a valid email.';
    }
    return newErrors;
  };

  const over250 = () => {
    if (characters.current > 250) {
      return true;
    } else {
      return false;
    }
  };

  const updateResource = () => {
    const updateDocRef = doc(resources, resource.id);
    updateDoc(updateDocRef, {
      description: resourceDescription,
      phone: resourcePhone,
      provider: resourceProvider,
      address: resourceAddress,
      website: resourceWebsite || null,
      email: resourceEmail || null,
      populationFilters: resourcePopulations || null,
      serviceFilters: resourcePrograms,
    }).then(() => {
      window.scrollTo(0, 0);
      setShowSuccessToast(true);
      updateReadOnly();
      setReadOnly(true);
    });
  };

  const saveEdits = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log(errors);
    } else {
      updateResource();
    }
  };

  const handleDeleteResource = () => {
    const deleteDocRef = doc(resources, resource.id);
    deleteDoc(deleteDocRef).then(() => {
      // clear specific form information & reset readOnly
      cancelEdits();
      // clear resource information
      setResource({});
      handleCloseDeleteWarn();
    });
  };

  // set alert information if there
  useEffect(() => {
    if (requestInfo.current > 0) {
      setShowAlert(true);
    }

    return () => {
      requestInfo.current = 0;
    };
  }, []);

  // Set program filters list
  useEffect(() => {
    const programFilterQuery = query(doc(db, 'Filters', 'Programs'));
    const programsSnapshot = getDoc(programFilterQuery).then(
      (programsSnapshot) => {
        setProgramFilters(programsSnapshot.data().filters.sort());
      }
    );
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

  const closeAlert = () => {
    setShowAlert(false);
    requestInfo.current = 0;
  };

  return (
    <Container className="mt-5 pt-5">
      <h2>Edit Resource</h2>
      {showAlert ? (
        <Alert variant="primary" onClose={() => closeAlert()} dismissible>
          <Alert.Heading>Edit Resource Request Information</Alert.Heading>
          Provider: {selected.provider}
          <br></br>
          Person Requesting: {selected.identifier}
          <br></br>
          Submission Contact Phone: {selected.phone}
          <br></br>
          Edit Requested: {selected.editRequest}
          <br></br>
          Date Submitted: {selected.dateSubmitted.toDateString()}
          <br></br>
        </Alert>
      ) : null}
      <Row className="pb-3">
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Enter Provider Name"
            onChange={(e) => updateSearchText(e.target.value)}
          />
        </Col>
        <Col>
          <Button variant="secondary" onClick={searchResources}>
            Search
          </Button>
        </Col>
      </Row>
      <Row>
        {searchLength.current > 0 ? (
          <Col>
            <Card className="text-bg-light">
              <Card.Header>
                <Card.Title>Resource Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form.Group
                  className="mb-3"
                  controlId="editResourceForm.provider"
                >
                  <Form.Label>Provider: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={resource.provider}
                    readOnly={readOnly}
                    value={resourceProvider}
                    isInvalid={errors.resourceProvider}
                    onChange={(e) =>
                      onResourceChange('provider', e.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.resourceProvider}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="editResourceForm.address"
                >
                  <Form.Label>Address: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={resource.address}
                    readOnly={readOnly}
                    value={resourceAddress}
                    isInvalid={errors.resourceAddress}
                    onChange={(e) =>
                      onResourceChange('address', e.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.resourceAddress}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="editResourceForm.phone">
                  <Form.Label>Phone: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={resource.phone}
                    value={resourcePhone}
                    readOnly={readOnly}
                    isInvalid={errors.resourcePhone}
                    onChange={(e) => onResourceChange('phone', e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.resourcePhone}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="editResourceForm.website"
                >
                  <Form.Label>Website: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={resource.website}
                    value={resourceWebsite}
                    readOnly={readOnly}
                    isInvalid={errors.resourceWebsite}
                    onChange={(e) =>
                      onResourceChange('website', e.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.resourceWebsite}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="editResourceForm.email">
                  <Form.Label>Email: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={resource.email}
                    value={resourceEmail}
                    readOnly={readOnly}
                    isInvalid={errors.resourceEmail}
                    onChange={(e) => onResourceChange('email', e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.resourceEmail}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="editResourceForm.description"
                >
                  <Form.Label>Description: </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={resource.description}
                    value={resourceDescription}
                    readOnly={readOnly}
                    isInvalid={errors.resourceDescription}
                    onChange={(e) =>
                      onResourceChange('description', e.target.value)
                    }
                  />
                  {over250() ? (
                    <Form.Text
                      className="text-danger"
                      style={{ fontSize: '0.875em' }}
                    >
                      {characters.current}/250
                    </Form.Text>
                  ) : (
                    <Form.Text muted>{characters.current}/250</Form.Text>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.resourceDescription}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="editResourceForm.populations"
                >
                  <Form.Label className="pe-3">
                    Populations (if applicable):{' '}
                  </Form.Label>
                  {readOnly ? (
                    <>
                      {populationFilters.map((p) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={p}
                          name="resourceFormPopulationsCheck"
                          id={p}
                          checked={resource.populationFilters.includes(p)}
                          readOnly={readOnly}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {populationFilters.map((p) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={p}
                          value={p}
                          name="resourceFormPopulationsCheck"
                          id={p}
                          checked={resourcePopulations.includes(p)}
                          readOnly={readOnly}
                          onChange={(e) =>
                            onResourceChange('populations', e.target.value)
                          }
                        />
                      ))}
                    </>
                  )}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="editResourceForm.services"
                >
                  <Form.Label className="pe-3">Programs: </Form.Label>
                  {readOnly ? (
                    <>
                      {programFilters.map((p) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={p}
                          checked={resource.serviceFilters.includes(p)}
                          name="resourceFormProgramsCheck"
                          id={p}
                          readOnly={readOnly}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {programFilters.map((p) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={p}
                          checked={resourcePrograms.includes(p)}
                          value={p}
                          name="resourceFormProgramsCheck"
                          id={p}
                          readOnly={readOnly}
                          isInvalid={errors.resourcePrograms}
                          onChange={(e) =>
                            onResourceChange('programs', e.target.value)
                          }
                        />
                      ))}
                    </>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.resourcePrograms}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                {!readOnly ? (
                  <Card.Text>
                    <Button
                      type="submit"
                      className="me-2"
                      onClick={(e) => saveEdits(e)}
                    >
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
                    onClick={() => editResource(resource)}
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
        {searchLength.current === 0 ? (
          <>
            <h4>No Resources Found</h4>
            <Link
              to="/admin/add-resource"
              state={{ selected: {} }}
              className="text-secondary fs-5"
            >
              Add New Resource
            </Link>
            <Link to="/" className="text-secondary fs-5">
              Check Full Resource List
            </Link>
          </>
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
          <Modal.Title>Delete Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          Are you sure you want to delete this resource? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer className="text-bg-light">
          <Button variant="secondary" onClick={handleCloseDeleteWarn}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteResource}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditResource;
