import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Fade from 'react-bootstrap/Fade';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import ResourceCard from '../resource-card/resource-card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
  mockResources,
  mockServiceFilters,
  mockPopulationFilters,
} from '../mock-data';
import './resources.css';

function Resources() {
  const [open, setOpen] = useState(false);
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [progFilter, setProgFilter] = useState('');
  const [popFilter, setPopFilter] = useState('');

  let resources = mockResources;
  let filteredResources = resources;
  let programFilters = mockServiceFilters.sort();
  let populationFilters = mockPopulationFilters.sort();

  const handleCloseNewResourceModal = () => setShowNewResourceModal(false);
  const handleShowNewResourceModal = () => setShowNewResourceModal(true);

  const handleCloseSuccessModal = () => setShowSuccessModal(false);
  const handleShowSuccessModal = () => setShowSuccessModal(true);

  const handleSubmitandClose = () => {
    handleCloseNewResourceModal();
    handleShowSuccessModal();
  };

  // filter statements
  if (searchText !== "") {
    filteredResources = filteredResources.filter(r => r.provider.toLowerCase().includes(searchText.toLowerCase()));
  }
  if (progFilter !== "") {
    filteredResources = filteredResources.filter(s => s.serviceFilters.includes(progFilter));

  }
  if (popFilter !== "") {
    filteredResources = filteredResources.filter(p => p.populationFilters.includes(popFilter));
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  return (
    <Fade in={open}>
      <Container className="resources">
        <h2>Resources</h2>
        <Row>
          <Col>
            <h4>Featured Programs and Announcements</h4>
            <div className="bg-secondary bg-opacity-50 border border-2 border-secondary rounded mb-2 pt-3 ps-3 pe-3">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3 mb-3">
          <Col md="auto">
            <h5 className="mt-2">Search and Filter: </h5>
          </Col>
          {/* text search feature */}
          <Col md='4' className='p-2'>
            <Form.Control
              type="text"
              className="text-filter-form"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Resources by Name"
            />
          </Col>
          {/* Program filter */}
          <Col md='auto' className='p-2'>
            <DropdownButton
              variant="secondary"
              id="program-filter-dropdown"
              title="Programs"
              onSelect={(p) => setProgFilter(p)}
            >
              {programFilters.map((p) => (
                <Dropdown.Item eventKey={p}>{p}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Population filter */}
          <Col md='auto' className='p-2'>
            <DropdownButton
              variant="secondary"
              id="population-filter-dropdown"
              title="Populations"
              onSelect={(f) => setPopFilter(f)}
            >
              {populationFilters.map((f) => (
                <Dropdown.Item eventKey={f}>{f}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        {/* Show selected filters */}
        <Row>
            {(progFilter !== '') ? (
              <Col xs='auto' className='pb-2'>
                <Button variant='outline-light' onClick={(e) => setProgFilter('')}>{progFilter} | X</Button>
              </Col>
            ): null}
            {(popFilter !== '') ? (
              <Col xs='auto'>
                <Button variant='outline-secondary' onClick={(e) => setPopFilter('')}>{popFilter} | X</Button>
              </Col>
            ): null}
        </Row>
        {/* Resource List */}
        <Row className="pt-2">
          {filteredResources.map((r) => (
            <Col sm='6' lg='4' className='mt-2'>
              <ResourceCard resource={r}/>
            </Col>
          ))}
        </Row>
        {/* Share a new resource */}
        <Row className="mt-2 pt-2 pb-2">
          <Col>
            <h4>Do you know of a resource that isn't on this list?</h4>
            <Button variant='secondary' onClick={handleShowNewResourceModal}>Share a New Resource</Button>
          </Col>
        </Row>
        {/* Share a new resource modal */}
        <Modal show={showNewResourceModal} onHide={handleCloseNewResourceModal}>
          <Modal.Header closeButton>
            <Modal.Title className="text-bg-light">Share a New Resource</Modal.Title>
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
                  name="newResourceFormRadios"
                  id="newResourceFormRadios1"
                />
                <Form.Check
                  required
                  type="radio"
                  label="Employee of this Provider"
                  name="newResourceFormRadios"
                  id="newResourceFormRadios2"
                />
                <Form.Check
                  required
                  type="radio"
                  label="Employee of another Provider"
                  name="newResourceFormRadios"
                  id="newResourceFormRadios3"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Provider">
                <Form.Label>Resource Provider Name:</Form.Label>
                <Form.Control type='text' required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Address">
                <Form.Label>Address:</Form.Label>
                <Form.Control type='text' required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Phone">
                <Form.Label>Phone:</Form.Label>
                <Form.Control type='text' required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Website">
                <Form.Label>Website Link (optional):</Form.Label>
                <Form.Control type='text'/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="newResourceForm.Description">
                <Form.Label>Provide a short description of the resource.</Form.Label>
                <Form.Control required as="textarea" rows={3} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type='submit' onClick={handleSubmitandClose}>
              Submit
            </Button>
            <Button variant="primary" onClick={handleCloseNewResourceModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Form Submit Success Modal */}
        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title className="text-bg-light">Request Submitted</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-bg-light">
            Your request has been sent to our admin.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSuccessModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fade>
  );
}

export default Resources;
