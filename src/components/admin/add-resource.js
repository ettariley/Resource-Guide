import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Link, useLocation } from 'react-router-dom';
import {
  query,
  where,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';

function AddResource() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const location = useLocation();
  const selected = location.state?.selected;
  const requestInfo = useRef(Object.keys(selected).length);
  const characters = useRef(0);
  const resources = collection(db, 'Resources');

  const [newResourcePopulations, setNewResourcePopulations] = useState([]);
  const [newResourcePrograms, setNewResourcePrograms] = useState([]);
  const [newResourceProvider, setNewResourceProvider] = useState('');
  const [newResourceAddress, setNewResourceAddress] = useState('');
  const [newResourcePhone, setNewResourcePhone] = useState('');
  const [newResourceWebsite, setNewResourceWebsite] = useState('');
  const [newResourceEmail, setNewResourceEmail] = useState('');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [programFilters, setProgramFilters] = useState([]);
  const [populationFilters, setPopulationFilters] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const onNewResourceChange = (type, value) => {
    switch (type) {
      case 'provider':
        setNewResourceProvider(value);
        if (!errors[newResourceProvider])
          setErrors({ ...errors, newResourceProvider: null });
        break;
      case 'address':
        setNewResourceAddress(value);
        if (!errors[newResourceAddress])
          setErrors({ ...errors, newResourceAddress: null });
        break;
      case 'phone':
        setNewResourcePhone(value);
        if (!errors[newResourcePhone])
          setErrors({ ...errors, newResourcePhone: null });
        break;
      case 'website':
        setNewResourceWebsite(value);
        if (!errors[newResourceWebsite])
          setErrors({ ...errors, newResourceWebsite: null });
        break;
      case 'email':
        setNewResourceEmail(value);
        if (!errors[newResourceEmail]) {
          setErrors({ ...errors, newResourceEmail: null });
        }
        break;
      case 'description':
        setNewResourceDescription(value);
        characters.current = value.length;
        if (!errors[newResourceDescription])
          setErrors({ ...errors, newResourceDescription: null });
        break;
      case 'populations':
        if (!newResourcePopulations.includes(value)) {
          setNewResourcePopulations([...newResourcePopulations, value]);
        } else {
          setNewResourcePopulations(
            newResourcePopulations.filter((r) => r !== value)
          );
        }
        if (!errors[newResourcePopulations])
          setErrors({ ...errors, newResourcePopulations: null });
        break;
      case 'programs':
        if (!newResourcePrograms.includes(value)) {
          setNewResourcePrograms([...newResourcePrograms, value]);
        } else {
          setNewResourcePrograms(
            newResourcePrograms.filter((r) => r !== value)
          );
        }
        if (!errors[newResourcePrograms])
          setErrors({ ...errors, newResourcePrograms: null });
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
    if (!newResourceProvider || newResourceProvider === '') {
      newErrors.newResourceProvider = 'Required';
    }
    if (!newResourceAddress || newResourceAddress === '') {
      newErrors.newResourceAddress = 'Required';
    }
    if (!newResourcePhone || newResourcePhone === '') {
      newErrors.newResourcePhone = 'Required';
    } else if (newResourcePhone !== '' && !newResourcePhone.match(phoneno)) {
      newErrors.newResourcePhone =
        'Phone number should be in 123-456-7890 format.';
    }
    if (!newResourceDescription || newResourceDescription === '') {
      newErrors.newResourceDescription = 'Required';
    } else if (newResourceDescription.length > 250) {
      newErrors.newResourceDescription =
        'Descriptions should be less than 250 characters.';
    }
    if (newResourcePrograms === [] || newResourcePrograms.length === 0) {
      newErrors.newResourcePrograms = 'You must select at least one program.';
    }
    if (newResourceWebsite !== '' && !newResourceWebsite.match(site)) {
      newErrors.newResourceWebsite = 'Please enter a valid URL.';
    }
    if (newResourceEmail !== '' && !email.test(newResourceEmail)) {
      newErrors.newResourceEmail = 'Please enter a valid email.';
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

  const clearFormFields = () => {
    setNewResourceAddress('');
    setNewResourceDescription('');
    setNewResourcePhone('');
    setNewResourceProvider('');
    setNewResourceWebsite('');
    setNewResourceEmail('');
    setNewResourcePopulations([]);
    setNewResourcePrograms([]);
  };

  const resetForm = () => {
    clearFormFields();
    setErrors({});
    setShowPreview(false);
  };

  const closeModalAndReset = () => {
    setShowDuplicateModal(false);
    resetForm();
  };

  const handlePreview = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setShowPreview(true);
    }
  };

  const hasPops = () => {
    if (newResourcePopulations.at(0) === '') {
      return false;
    } else if (newResourcePopulations.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const addNewResource = () => {
    const newResourceRef = addDoc(resources, {
      description: newResourceDescription,
      phone: newResourcePhone,
      provider: newResourceProvider,
      address: newResourceAddress,
      website: newResourceWebsite || null,
      email: newResourceEmail || null,
      populationFilters: newResourcePopulations || null,
      serviceFilters: newResourcePrograms,
    }).then(() => {
      resetForm();
      setShowAlert(false);
      setShowSuccessModal(true);
    });
  };

  const handleSubmitNewResource = async () => {
    // check for provider name first
    const resourcesQuery = query(
      resources,
      where('provider', '==', newResourceProvider)
    );
    const resourcesSnapshot = await getCountFromServer(resourcesQuery);
    const duplicateCount = resourcesSnapshot.data().count;
    console.log(duplicateCount);
    if (duplicateCount > 0) {
      setShowDuplicateModal(true);
    } else {
      addNewResource();
    }
  };

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
      <h2>Add Resource</h2>
      {showAlert ? (
        <Alert variant="primary" onClose={() => closeAlert()} dismissible>
          <Alert.Heading>New Resource Request Information</Alert.Heading>
          Provider: {selected.provider}
          <br></br>
          Description: {selected.description}
          <br></br>
          Person Requesting: {selected.identifier}
          <br></br>
          Date Submitted: {selected.dateSubmitted.toDateString()}
          <br></br>
          Address: {selected.address}
          <br></br>
          Phone: {selected.phone}
          <br></br>
          Website: {selected.website}
          <br></br>
          Email: {selected.email}
        </Alert>
      ) : null}
      <Row>
        <Col>
          <Form noValidate>
            <Form.Group className="mb-2" controlId="newResourceForm.Provider">
              <Form.Label>Resource Provider Name:</Form.Label>
              <Form.Control
                type="text"
                value={newResourceProvider}
                isInvalid={errors.newResourceProvider}
                onChange={(e) =>
                  onNewResourceChange('provider', e.target.value)
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.newResourceProvider}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" controlId="newResourceForm.Address">
              <Form.Label>Address:</Form.Label>
              <Form.Control
                type="text"
                value={newResourceAddress}
                isInvalid={errors.newResourceAddress}
                onChange={(e) => onNewResourceChange('address', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newResourceAddress}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" controlId="newResourceForm.Phone">
              <Form.Label>Phone:</Form.Label>
              <Form.Control
                type="tel"
                value={newResourcePhone}
                isInvalid={errors.newResourcePhone}
                onChange={(e) => onNewResourceChange('phone', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newResourcePhone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" controlId="newResourceForm.Website">
              <Form.Label>Website Link (optional):</Form.Label>
              <Form.Control
                type="url"
                value={newResourceWebsite}
                isInvalid={errors.newResourceWebsite}
                onChange={(e) => onNewResourceChange('website', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newResourceWebsite}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" controlId="newResourceForm.Email">
              <Form.Label>Email (optional):</Form.Label>
              <Form.Control
                type="email"
                value={newResourceEmail}
                isInvalid={errors.newResourceEmail}
                onChange={(e) => onNewResourceChange('email', e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.newResourceEmail}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-2"
              controlId="newResourceForm.Description"
            >
              <Form.Label>
                Provide a short description of the resource.
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newResourceDescription}
                isInvalid={errors.newResourceDescription}
                onChange={(e) =>
                  onNewResourceChange('description', e.target.value)
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
                {errors.newResourceDescription}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-2"
              controlId="newResourceForm.Populations"
            >
              <Form.Label className="pe-3">
                Populations (if applicable):{' '}
              </Form.Label>
              {populationFilters.map((p) => (
                <Form.Check
                  inline
                  type="checkbox"
                  label={p}
                  value={p}
                  name="newResourceFormPopulationsCheck"
                  id={p}
                  checked={newResourcePopulations.includes(p)}
                  onChange={(e) =>
                    onNewResourceChange('populations', e.target.value)
                  }
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-2" controlId="newResourceForm.Programs">
              <Form.Label className="pe-3">Programs: </Form.Label>
              {programFilters.map((p) => (
                <Form.Check
                  inline
                  type="checkbox"
                  label={p}
                  value={p}
                  name="newResourceFormProgramsCheck"
                  id={p}
                  isInvalid={errors.newResourcePrograms}
                  checked={newResourcePrograms.includes(p)}
                  onChange={(e) =>
                    onNewResourceChange('programs', e.target.value)
                  }
                />
              ))}
              <Form.Control.Feedback type="invalid">
                {errors.newResourcePrograms}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          <button
            className="btn btn-secondary me-3"
            type="submit"
            onClick={handlePreview}
            disabled={showPreview}
          >
            Preview
          </button>
          <Button variant="danger" onClick={() => resetForm()}>
            Reset
          </Button>
        </Col>
        {showPreview ? (
          <Col>
            <h4>Preview:</h4>
            <Card>
              <Card.Body className="text-bg-light">
                <Card.Title>{newResourceProvider}</Card.Title>
                <Card.Subtitle className="mb-3">
                  {newResourceAddress}
                </Card.Subtitle>
                <Card.Text>
                  {newResourceWebsite ? (
                    <Card.Link href={newResourceWebsite} target="_blank">
                      See Website <i className="bi bi-box-arrow-up-right"></i>
                    </Card.Link>
                  ) : null}
                  <Card.Link href={`tel:` + newResourcePhone} target="_blank">
                    Call {newResourcePhone}
                  </Card.Link>
                </Card.Text>
                <Card.Text>{newResourceDescription}</Card.Text>
                <h5>Programs:</h5>
                {newResourcePrograms.map((s) => (
                  <ListGroup key={s} horizontal className="filter-list m-1">
                    <ListGroup.Item variant="primary">{s}</ListGroup.Item>
                  </ListGroup>
                ))}
                {hasPops() ? (
                  <>
                    <h5>Populations:</h5>
                    {newResourcePopulations.map((p) => (
                      <ListGroup horizontal className="filter-list m-1">
                        <ListGroup.Item variant="secondary">{p}</ListGroup.Item>
                      </ListGroup>
                    ))}
                  </>
                ) : null}
              </Card.Body>
              <Card.Footer>
                <Alert variant="danger">
                  You can still make changes to the resource in the form or
                  reset the form to clear all fields. If all information is
                  correct, select Add New Resource.
                </Alert>
                <Button
                  className="w-100"
                  onClick={() => handleSubmitNewResource()}
                >
                  Add New Resource
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ) : null}
      </Row>
      {/* Return to admin dashboard button */}
      <Row className="mt-4 mb-2">
        <Col className="ps-0">
          <Button variant="outline-light" size="sm" as={Link} to="/admin">
            <i className="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
      {/* Duplicate resource modal */}
      <Modal
        show={showDuplicateModal}
        onHide={() => setShowDuplicateModal(false)}
      >
        <Modal.Header>
          <Modal.Title className="text-bg-light">
            Provider Already Exists
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">
          A resource with this provider name already exists.
        </Modal.Body>
        <Modal.Footer className="">
          <Button
            variant="secondary"
            onClick={() => setShowDuplicateModal(false)}
          >
            <Link to="/admin/edit-resource" state={{ selected: {} }}>
              Edit Existing Resource
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDuplicateModal(false)}
          >
            Edit New Resource
          </Button>
          <Button variant="danger" onClick={closeModalAndReset}>
            Reset Form
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Success modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-bg-light">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-light">New resource added!</Modal.Body>
      </Modal>
    </Container>
  );
}

export default AddResource;
