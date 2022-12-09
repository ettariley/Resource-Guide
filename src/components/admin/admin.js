import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { programFiltersAtom, programsLengthAtom, currentFilterListAtom, currentFilterTypeAtom } from '../../atoms';
import FilterModal from '../resources/filter-modal';
import { query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function Admin({ loggedIn }) {
  const [open, setOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [programFilters, setProgramFilters] = useAtom(programFiltersAtom);
  const [programsLength] = useAtom(programsLengthAtom);
  const [populationFilters, setPopulationFilters] = useState([]);
  const [eventTags, setEventTags] = useState([]);
  const [filterList, setFilterList] = useAtom(currentFilterListAtom);
  const [filterType, setFilterType] = useAtom(currentFilterTypeAtom);

  const navigate = useNavigate();

  // Methods for opening & closing modals
  const handleCloseFilterModal = () => setShowFilterModal(false);
  const handleShowFilterModal = () => setShowFilterModal(true);

  const displayList = (filterCategory) => {
    let filters = [""];
    switch (filterCategory) {
      case "Populations":
        filters = populationFilters;
        break;
      case "Programs":
        filters = programFilters;
        break;
      case "Event Tags":
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
  }

  useEffect(() => {
    if (!localStorage.getItem('loggedIn') || localStorage.getItem('loggedIn') === false) {
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

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Admin Page</h2>
        <Row className="mb-4">
          <Col>
            <Card className="text-bg-light">
              <Card.Body className="text-bg-light">
                <Card.Title>Requests</Card.Title>
                <Card.Text>
                  <Button variant="secondary">
                    Resource Edit Requests <Badge pill>0</Badge>
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">
                    New Resource Requests <Badge pill>0</Badge>
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">
                    New Event Requests <Badge pill>0</Badge>
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-bg-light">
              <Card.Body className="text-bg-light">
                <Card.Title>Resources</Card.Title>
                <Card.Text>
                  <Button variant="secondary">Add New Resource</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">Edit or Remove Resource</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-bg-light">
              <Card.Body className="text-bg-light">
                <Card.Title>Events</Card.Title>
                <Card.Text>
                  <Button variant="secondary">Add New Event</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">Edit or Remove Event</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Card className="text-bg-light">
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
          <Col>
            <Card className="text-bg-light">
              <Card.Body className="text-bg-light">
                <Card.Title>Featured text</Card.Title>
                <Card.Text>
                  <Button variant="secondary">
                    Edit Resources Page Featured Text
                  </Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary">
                    Edit Events Page Featured Text
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-bg-light">
              <Card.Body className="text-bg-light">
                <Card.Title>Filters</Card.Title>
                <Card.Text>
                  <Button variant="secondary" onClick={() => handleShowFilterModal("Populations")}>Edit Population Filters</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary"  onClick={() => displayList("Programs")}>Edit Program Filters</Button>
                </Card.Text>
                <Card.Text>
                  <Button variant="secondary"  onClick={() => handleShowFilterModal("Event Tags")}>Edit Event Tags</Button>
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
