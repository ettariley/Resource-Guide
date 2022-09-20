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
            <div className='bg-secondary bg-opacity-50 border border-2 border-secondary rounded mb-2 pt-3 ps-3 pe-3'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </Col>
        </Row>
        <Row className='mt-3 mb-3'>
          <Col sm='auto'>
            <h5 className='mt-2'>Search & Filter: </h5>
          </Col>
          {/* text search feature */}
          <Col>
            <Form.Control
              type='text'
              className='text-filter-form'
              placeholder='Search Resources'
            />
          </Col>
          {/* Program filter */}
          <Col sm='auto'>
            <DropdownButton variant='secondary' id='program-filter-dropdown' title='Programs'>
              {programFilters.map(p => (
                <Dropdown.Item href='#/action'>{p}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          {/* Population filter */}
          <Col sm='auto'>
            <DropdownButton variant='secondary' id='population-filter-dropdown' title='Populations'>
              {populationFilters.map(f => (
                <Dropdown.Item href='#/action'>{f}</Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        {/* Resource List */}
        <Row className='mt-2 pt-2'>
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