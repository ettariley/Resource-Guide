import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Fade from 'react-bootstrap/Fade';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form'
import ResourceCard from '../resource-card/resource-card';
import { mockResources, mockServiceFilters, mockPopulationFilters } from '../mock-data';
import './resources.css';

function Resources() {
  const [open, setOpen] = useState(false);
  let resources = mockResources;
  let programFilters = mockServiceFilters.sort();
  let populationFilters = mockPopulationFilters.sort();

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  });

  return (
    <Fade in={open}>
      <Container className='resources'>
        <h2>Resources</h2>
        <Row>
          <Col>
            <h4>Featured Programs & Announcements</h4>
            <p>Featured program and announcement information goes here.</p>
          </Col>
        </Row>
        <Row>
          <h4>Search & Filter</h4>
          {/* text search feature */}
          <Col>
            <Form.Control
              type='text'
              className='text-filter-form'
              placeholder='Search Resources'
            />
          </Col>
          {/* Program filter */}
          <Col>
            <DropdownButton variant='secondary' id='program-filter-dropdown' title='Programs'>
              {programFilters.map(p => (
                <Dropdown.Item href='#/action'>{p}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Population filter */}
          <Col>
            <DropdownButton variant='secondary' id='population-filter-dropdown' title='Populations'>
              {populationFilters.map(f => (
                <Dropdown.Item href='#/action'>{f}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        {/* Resource List */}
        <Row className='pt-2'>
          <h4>Resource List</h4>
          {resources.map(r => (
            <Col>
              <ResourceCard resource={r} />
            </Col>
          ))}
        </Row>
      </Container>
    </Fade>
  );
}

export default Resources;