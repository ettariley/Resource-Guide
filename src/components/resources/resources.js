import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Fade from 'react-bootstrap/Fade';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import ResourceCard from '../resource-card/resource-card';
import SuccessModal from '../success-modal/success-modal';
import uuid from 'react-uuid';
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
import './resources.css';

function Resources() {
  const [open, setOpen] = useState(false);
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resourcesList, setResourcesList] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [featuredResourcesText, setFeaturedResourcesText] = useState('');
  const [displayFeaturedResourcesText, setDisplayFeaturedResourcesText] = useState(false);
  // for new resource form
  const [formResourceIdentifier, setFormResourceIdentifier] = useState('');
  const [formResourceProvider, setFormResourceProvider] = useState('');
  const [formResourceAddress, setFormResourceAddress] = useState('');
  const [formResourcePhone, setFormResourcePhone] = useState('');
  const [formResourceWebsite, setFormResourceWebsite] = useState('');
  const [formResourceDescription, setFormResourceDescription] = useState('');
  // for dropdown lists of filters
  const [programFilters, setProgramFilters] = useState([]);
  const [populationFilters, setPopulationFilters] = useState([]);

  // for setting filters
  const searchText = useRef('');
  const progFilter = useRef('');
  const popFilter = useRef('');
  let filteredArray = [];

  // methods for updating refs
  const updateSearchText = (value) => {
    searchText.current = value;
    filterResources();
  };
  const updateProgFilter = (prog) => {
    progFilter.current = prog;
    filterResources();
  };
  const updatePopFilter = (pop) => {
    popFilter.current = pop;
    filterResources();
  };

  // Set featured text
  const featuredTextQuery = query(doc(db, 'Featured-Texts', 'ResourcePage'));
  const textSnapshot = getDoc(featuredTextQuery).then((textSnapshot) => {
    setFeaturedResourcesText(textSnapshot.data().Text);
    setDisplayFeaturedResourcesText(textSnapshot.data().display);
  });

  // Methods for opening & closing modals
  const handleCloseNewResourceModal = () => setShowNewResourceModal(false);
  const handleShowNewResourceModal = () => setShowNewResourceModal(true);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);

  const handleSubmitandClose = () => {
    const newResourceRef = addDoc(collection(db, 'Resource-Requests'), {
      description: formResourceDescription,
      id: uuid(),
      identifier: formResourceIdentifier,
      phone: formResourcePhone,
      provider: formResourceProvider,
      address: formResourceAddress,
      website: formResourceWebsite || null,
      read: false,
    }).then(() => {
      handleCloseNewResourceModal();
      handleShowSuccessModal();
    });    
  };

  // filter statements
  const filterResources = () => {
    console.log("text: " + searchText.current);
    console.log("prog: " + progFilter.current);
    console.log("pop: " + popFilter.current);
    switch (true) {
      case (searchText.current !== '' && progFilter.current !== '' && popFilter.current !== ''):
        filteredArray = filteredResources.filter((r) =>
          r.provider.toLowerCase().includes(searchText.current.toLowerCase())
        );
        filteredArray = filteredArray.filter((s) => s.serviceFilters.includes(progFilter.current));
        filteredArray = filteredArray.filter((p) => p.populationFilters.includes(popFilter.current));
        setFilteredResources(filteredArray);
        break;
      case (searchText.current !== '' && progFilter.current !== ''):
        filteredArray = filteredResources.filter((r) =>
          r.provider.toLowerCase().includes(searchText.current.toLowerCase())
        );
        filteredArray = filteredArray.filter((s) => s.serviceFilters.includes(progFilter.current));
        setFilteredResources(filteredArray);
        break;
      case (searchText.current !== '' && popFilter.current !== ''):
        filteredArray = filteredResources.filter((r) =>
          r.provider.toLowerCase().includes(searchText.current.toLowerCase())
        );
        filteredArray = filteredArray.filter((p) => p.populationFilters.includes(popFilter.current));
        setFilteredResources(filteredArray);
        break;
      case (progFilter.current !== '' && popFilter.current !== ''):
        filteredArray = filteredResources.filter((s) => s.serviceFilters.includes(progFilter.current));
        filteredArray = filteredArray.filter((p) => p.populationFilters.includes(popFilter.current));
        setFilteredResources(filteredArray);
        break;
      case (searchText.current !== ''):
        setFilteredResources(
          resourcesList.filter((r) =>
            r.provider.toLowerCase().includes(searchText.current.toLowerCase())
        ));
        break;
      case (progFilter.current !== ''):
        setFilteredResources(resourcesList.filter((s) => s.serviceFilters.includes(progFilter.current)));
        break;
      case (popFilter.current !== ''):
        setFilteredResources(resourcesList.filter((p) => p.populationFilters.includes(popFilter.current)));
        break;
      default:
        setFilteredResources(resourcesList);
        break;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  // set list of resources on first render
  useEffect(() => {
    // Set resources and blank array
    const resources = collection(db, 'Resources');
    const resourcesArray = [];
    // get resources in order from database and push to array
    const resourcesQuery = query(resources, orderBy('provider'));
    const resourcesQSnapshot = getDocs(resourcesQuery).then(
      (resourcesQSnapshot) => {
        resourcesQSnapshot.forEach((doc) => {
          let data = doc.data();
          resourcesArray.push({
            address: data.address,
            description: data.description,
            id: data.id,
            phone: data.phone,
            populationFilters: data.populationFilters,
            provider: data.provider,
            serviceFilters: data.serviceFilters,
            website: data.website,
          });
        });
        setResourcesList(resourcesArray);
        setFilteredResources(resourcesArray);
      }
    );
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

  return (
    <Fade in={open}>
      <Container className="resources">
        <h2>Resources</h2>
        {displayFeaturedResourcesText ? (
          <Row>
            <Col>
              <h4>Featured Programs and Announcements</h4>
              {/* <div className="bg-secondary bg-opacity-50 border border-2 border-secondary rounded mb-2 pt-3 ps-3 pe-3">
                <p>{featuredResourcesText}</p>
              </div> */}
              <Alert variant='secondary'>{featuredResourcesText}</Alert>
            </Col>
          </Row>  
        ) : null}
        <Row className="mt-3 mb-3">
          <Col md="auto">
            <h5 className="mt-2">Search and Filter: </h5>
          </Col>
          {/* text search feature */}
          <Col md="4" className="p-2">
            <Form.Control
              type="text"
              className="text-filter-form"
              value={searchText.current}
              onChange={(e) => updateSearchText(e.target.value)}
              placeholder="Search Resources by Name"
            />
          </Col>
          {/* Program filter */}
          <Col md="auto" className="p-2">
            <DropdownButton
              variant="secondary"
              id="program-filter-dropdown"
              title="Services"
              onSelect={(p) => updateProgFilter(p)}
            >
              {programFilters.map((p) => (
                <Dropdown.Item key={p} eventKey={p}>
                  {p}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Population filter */}
          <Col md="auto" className="p-2">
            <DropdownButton
              variant="secondary"
              id="population-filter-dropdown"
              title="Populations"
              onSelect={(f) => updatePopFilter(f)}
            >
              {populationFilters.map((f) => (
                <Dropdown.Item key={f} eventKey={f}>
                  {f}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        {/* Show selected filters */}
        <Row>
          {progFilter.current !== '' ? (
            <Col xs="auto" className="pb-2">
              <Button
                variant="outline-light"
                onClick={(e) => updateProgFilter('')}
              >
                {progFilter.current} | X
              </Button>
            </Col>
          ) : null}
          {popFilter.current !== '' ? (
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                onClick={(e) => updatePopFilter('')}
              >
                {popFilter.current} | X
              </Button>
            </Col>
          ) : null}
        </Row>
        {/* Resource List */}
        <Row className="pt-2">
          {filteredResources.map((r) => (
            <Col sm="6" lg="4" className="mt-2">
              <ResourceCard key={r.id} resource={r} />
            </Col>
          ))}
        </Row>
        {/* Share a new resource */}
        <Row className="mt-2 pt-2 pb-2">
          <Col>
            <h4>Do you know of a resource that isn't on this list?</h4>
            <Button variant="secondary" onClick={handleShowNewResourceModal}>
              Share a New Resource
            </Button>
          </Col>
        </Row>
        {/* Share a new resource modal */}
        <Modal show={showNewResourceModal} onHide={handleCloseNewResourceModal}>
          <Modal.Header closeButton>
            <Modal.Title className="text-bg-light">
              Share a New Resource
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            <Form>
              <Form.Group
                className="mb-3"
                controlId="newResourceForm.Identifier"
              >
                <Form.Label>I am a...</Form.Label>
                <Form.Check
                  required
                  type="radio"
                  label="Community Member"
                  value="Community Member"
                  name="newResourceFormRadios"
                  id="newResourceFormRadios1"
                  onChange={(e) => setFormResourceIdentifier(e.target.value)}
                />
                <Form.Check
                  required
                  type="radio"
                  label="Employee of this Provider"
                  value="Employee of this Provider"
                  name="newResourceFormRadios"
                  id="newResourceFormRadios2"
                  onChange={(e) => setFormResourceIdentifier(e.target.value)}
                />
                <Form.Check
                  required
                  type="radio"
                  label="Employee of another Provider"
                  value="Employee of another Provider"
                  name="newResourceFormRadios"
                  id="newResourceFormRadios3"
                  onChange={(e) => setFormResourceIdentifier(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Provider">
                <Form.Label>Resource Provider Name:</Form.Label>
                <Form.Control type="text" value={formResourceProvider} onChange={(e) => setFormResourceProvider(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Address">
                <Form.Label>Address:</Form.Label>
                <Form.Control type="text" value={formResourceAddress} onChange={(e) => setFormResourceAddress(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Phone">
                <Form.Label>Phone:</Form.Label>
                <Form.Control type="tel" value={formResourcePhone} onChange={(e) => setFormResourcePhone(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Website">
                <Form.Label>Website Link (optional):</Form.Label>
                <Form.Control type="url" value={formResourceWebsite} onChange={(e) => setFormResourceWebsite(e.target.value)} />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="newResourceForm.Description"
              >
                <Form.Label>
                  Provide a short description of the resource.
                </Form.Label>
                <Form.Control required as="textarea" rows={3} value={formResourceDescription} onChange={(e) => setFormResourceDescription(e.target.value)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              type="submit"
              onClick={handleSubmitandClose}
            >
              Submit
            </Button>
            <Button variant="primary" onClick={handleCloseNewResourceModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Form Submit Success Modal */}
        <SuccessModal
          showSuccessModal={showSuccessModal}
          handleCloseSuccessModal={handleCloseSuccessModal}
        />
      </Container>
    </Fade>
  );
}

export default Resources;
