import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { mockAboutText, mockAboutPartners } from '../mock-data';

function About() {
  let partners = mockAboutPartners;
  let aboutText = mockAboutText;

  return (
    <Container>
      <h2>About</h2>
      <Row>
        {aboutText.map(text => (
          <Col>
            {text.text}
          </Col>
        ))}
      </Row>
      <Row>
        <h3>Partners</h3>
          {partners.map(p => (
            <Col key={p.name}>
              <Button variant='link' href={p.link} target='_blank'>{p.name}</Button>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default About;