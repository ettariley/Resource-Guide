import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  programFiltersAtom,
  programsLengthAtom,
  currentFilterListAtom,
  currentFilterTypeAtom,
} from '../../atoms';
import FilterModal from './filter-modal';
import EditResourceRequests from './edit-resource-requests';
import ResourceRequests from './resource-requests';
import EventRequests from './event-requests';
import AddEvent from './add-event';
import EditEvent from './edit-event';
import AddResource from './add-resource';
import EditResource from './edit-resource';
import { query, doc, getDoc, collection, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';

function Admin() {
  const [open, setOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [programFilters, setProgramFilters] = useAtom(programFiltersAtom);
  const [programsLength] = useAtom(programsLengthAtom);
  const [populationFilters, setPopulationFilters] = useState([]);
  const [eventTags, setEventTags] = useState([]);
  const [filterList, setFilterList] = useAtom(currentFilterListAtom);
  const [filterType, setFilterType] = useAtom(currentFilterTypeAtom);
  const [unreadNewResources, setUnreadNewResources] = useState('');
  const [unreadNewEvents, setUnreadNewEvents] = useState('');
  const [unreadEditResource, setUnreadEditResource] = useState('');

  const navigate = useNavigate();

  // Methods for opening & closing modals
  const handleCloseFilterModal = () => setShowFilterModal(false);
  const handleShowFilterModal = () => setShowFilterModal(true);

  const displayList = (filterCategory) => {
    let filters = [''];
    switch (filterCategory) {
      case 'Populations':
        filters = populationFilters;
        break;
      case 'Programs':
        filters = programFilters;
        break;
      case 'Event Tags':
        filters = eventTags;
        break;
      default:
        filters = [''];
        break;
    }
    console.log(filters);
    console.log(filterCategory);
    setFilterList([...filters]);
    setFilterType(filterCategory);
    console.log(filterList);

    handleShowFilterModal();
  };

  // Check auth
  useEffect(() => {
    if (
      !sessionStorage.getItem('Auth Token') ||
      sessionStorage.getItem('Auth Token') === false
    ) {
      navigate('/login');
    }
  }, []);

  // Set program filters list
  useEffect(() => {
    console.log(programsLength);
    if (programsLength === 0) {
      const programFilterQuery = query(doc(db, 'Filters', 'Programs'));
      const programsSnapshot = getDoc(programFilterQuery).then(
        (programsSnapshot) => {
          setProgramFilters(programsSnapshot.data().filters.sort());
        }
      );
    }
    console.log(programFilters);
  }, []);

  // Set unread badges
  useEffect(() => {
    // edit resource requests
    const editRequests = collection(db, 'Edit-Requests');
    const editRequestsUnreadQuery = query(editRequests, where('read', '==', false));
    const editRequestsUnreadSnapshot = getCountFromServer(editRequestsUnreadQuery).then((editRequestsUnreadSnapshot) => {
      setUnreadEditResource(editRequestsUnreadSnapshot.data().count);
    });
    // new resource requests
    const newResources = collection(db, 'Resource-Requests');
    const newResourcesUnreadQuery = query(newResources, where('read', '==', false));
    const newResourcesUnreadSnapshot = getCountFromServer(newResourcesUnreadQuery).then((newResourcesUnreadSnapshot) => {
      setUnreadNewResources(newResourcesUnreadSnapshot.data().count);
    });
    // edit resource requests
    const newEvents = collection(db, 'Event-Requests');
    const newEventsUnreadQuery = query(newEvents, where('read', '==', false));
    const newEventsUnreadSnapshot = getCountFromServer(newEventsUnreadQuery).then((newEventsUnreadSnapshot) => {
      setUnreadNewEvents(newEventsUnreadSnapshot.data().count);
    });
  }, []);

  // Set population filters list
  useEffect(() => {
    const populationFilterQuery = query(doc(db, 'Filters', 'Populations'));
    const populationsSnapshot = getDoc(populationFilterQuery).then(
      (populationsSnapshot) => {
        setPopulationFilters(populationsSnapshot.data().filters.sort());
      }
    );
    // console.log(populationFilters);
  }, []);

  // Set tag filters list
  useEffect(() => {
    const tagsFilterQuery = query(doc(db, 'Filters', 'EventTags'));
    const tagsSnapshot = getDoc(tagsFilterQuery).then((tagsSnapshot) => {
      setEventTags(tagsSnapshot.data().tags.sort());
    });
    // console.log(eventTags);
  }, []);

  // page opening settings
  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Admin Dashboard</h2>
        <Row xs={1} sm={2} lg={3} xl={4}>
          <Col className='mb-4'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>Requests</Card.Title>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="edit-requests">
                    Resource Edit Requests <Badge pill>{unreadEditResource}</Badge>
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="resource-requests">
                    New Resource Requests <Badge pill>{unreadNewResources}</Badge>
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="event-requests">
                    New Event Requests <Badge pill>{unreadNewEvents}</Badge>
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='mb-4'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>Resources</Card.Title>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="add-resource" state={{ selected: {} }}>Add New Resource</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="edit-resource" state={{ selected: {} }}>Edit or Remove Resource</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='mb-4'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>Events</Card.Title>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="add-event" state={{ selected: {} }}>Add New Event</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary" as={Link} to="edit-event">Edit or Remove Event</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='mb-4 d-none'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>About Page</Card.Title>
                <Card.Text>
                  <Button variant="secondary">Edit About Page Text</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">Edit Partners</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='mb-4 d-none'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>Featured text</Card.Title>
                <Card.Text>
                  <Button variant="secondary">
                    Edit on Resources Page
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">
                    Edit on Events Page
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='mb-4 d-none'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>Filters</Card.Title>
                <Card.Text>
                  <Button
                    variant="secondary"
                    onClick={() => handleShowFilterModal('Populations')}
                  >
                    Edit Population Filters
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button
                    variant="secondary"
                    onClick={() => displayList('Programs')}
                  >
                    Edit Program Filters
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button
                    variant="secondary"
                    onClick={() => handleShowFilterModal('Event Tags')}
                  >
                    Edit Event Tags
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='mb-4 d-none'>
            <Card className="text-bg-light h-100">
              <Card.Body className="text-bg-light">
                <Card.Title>Admin Settings</Card.Title>
                <Card.Text>
                  <Button variant="secondary">Change Email Address</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">Change Password</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <FilterModal
          showFilterModal={showFilterModal}
          handleCloseFilterModal={handleCloseFilterModal}
        />
      </Container>
    </Fade>
  );
}

export default Admin;
