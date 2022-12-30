import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { Link, useLocation } from 'react-router-dom';
import {
  query,
  orderBy,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import './admin.css';

function AddResource() {
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const selected = location.state?.selected;
  const requestInfo = useRef(Object.keys(selected).length);

  const [newResourcePopulations, setNewResourcePopulations] = useState([]);
  const [newResourceServices, setNewResourceServices] = useState([]);
  const [newResourceProvider, setNewResourceProvider] = useState('');
  const [newResourceAddress, setNewResourceAddress] = useState('');
  const [newResourcePhone, setNewResourcePhone] = useState('');
  const [newResourceWebsite, setNewResourceWebsite] = useState('');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [programFilters, setProgramFilters] = useState([]);
  const [populationFilters, setPopulationFilters] = useState([]);

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
      case 'description':
        setNewResourceDescription(value);
        if (!errors[newResourceDescription])
          setErrors({ ...errors, newResourceDescription: null });
        break;
      case 'populations':
        setNewResourcePopulations({ ...newResourcePopulations, value });
        if (!errors[newResourcePopulations])
          setErrors({ ...errors, newResourcePopulations: null });
          break;
      case 'programs':
        setNewResourcePopulations({ ...newResourceServices, value });
        if (!errors[newResourceServices])
          setErrors({ ...errors, newResourceServices: null });
          break;
      default:
        break;
    }
  };

  const findFormErrors = () => {
    const newErrors = {};
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const site = /^(ftp|http|https):\/\/[^ "]+$/;
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
        'Phone number should be in 123-456-7890 or 123.456.7890 format.';
    }
    if (!newResourceDescription || newResourceDescription === '') {
      newErrors.newResourceDescription = 'Required';
    }
    if (newResourceServices === []) {
      newErrors.newResourceServices = 'You must select at least one program.';
    }
    if (newResourceWebsite !== '' && !newResourceWebsite.match(site)) {
      newErrors.newResourceWebsite = 'Please enter a valid URL.';
    }

    return newErrors;
  };

  const clearFormFields = () => {
    setNewResourceAddress('');
    setNewResourceDescription('');
    setNewResourcePhone('');
    setNewResourceProvider('');
    setNewResourceWebsite('');
    setNewResourcePopulations([]);
    setNewResourceServices([]);
  };

  const handleSubmitandClose = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const newResourceRef = addDoc(collection(db, 'Resources'), {
        description: newResourceDescription,
        phone: newResourcePhone,
        provider: newResourceProvider,
        address: newResourceAddress,
        website: newResourceWebsite || null,
        populationFilters: newResourcePopulations || null,
        serviceFilters: newResourceServices,
      }).then(() => {
        // handleCloseNewResourceModal();
        // handleShowSuccessModal();
        clearFormFields();
      });
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
        </Alert>
      ) : null}
      <Row>
        <Form noValidate>
          <Form.Group className="mb-3" controlId="newResourceForm.Provider">
            <Form.Label>Resource Provider Name:</Form.Label>
            <Form.Control
              type="text"
              value={newResourceProvider}
              isInvalid={errors.newResourceProvider}
              onChange={(e) => onNewResourceChange('provider', e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newResourceProvider}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="newResourceForm.Address">
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
          <Form.Group className="mb-3" controlId="newResourceForm.Phone">
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
          <Form.Group className="mb-3" controlId="newResourceForm.Website">
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
          <Form.Group className="mb-3" controlId="newResourceForm.Description">
            <Form.Label>
              Provide a short description of the resource.
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newResourceDescription}
              isInvalid={errors.newResourcePhone}
              onChange={(e) =>
                onNewResourceChange('description', e.target.value)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.newResourceDescription}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="newResourceForm.Populations"
          >
            <Form.Label className='pe-3'>Populations: </Form.Label>
            {populationFilters.map((p) => (
              <Form.Check
                inline
                type="checkbox"
                label={p}
                value={p}
                name="newResourceFormPopulationsCheck"
                id={p}
                onChange={(e) =>
                  onNewResourceChange('populations', e.target.value)
                }
              />
            ))}
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="newResourceForm.Programs"
          >
            <Form.Label className='pe-3'>Programs: </Form.Label>
            {programFilters.map((p) => (
              <Form.Check
                inline
                type="checkbox"
                label={p}
                value={p}
                name="newResourceFormProgramsCheck"
                id={p}
                isInvalid={errors.newResourceServices}
                onChange={(e) =>
                  onNewResourceChange('programs', e.target.value)
                }
              />
            ))}
            <Form.Control.Feedback type="invalid">
              {errors.newResourceServices}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
        <Button
          variant="secondary"
          type="submit"
          onClick={handleSubmitandClose}
        >
          Submit
        </Button>
        <Button variant="primary" onClick={() => clearFormFields()}>
          Reset
        </Button>
      </Row>
      {/* Return to admin dashboard button */}
      <Row className="mt-4 mb-2">
        <Col className="ps-0">
          <Button variant="outline-light" size="sm" as={Link} to="/admin">
            <i className="bi bi-arrow-left"></i> Back to Admin Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default AddResource;
