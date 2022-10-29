import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import { mockAboutText, mockAboutPartners } from '../mock-data';
import './about.css';

function About() {
  const [open, setOpen] = useState(false);

  let partners = mockAboutPartners;
  let aboutText = mockAboutText;

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  });

  return (
    <Fade in={open}>
      <Container className="about">
        <h2>About</h2>
        {/* as rows */}
        {aboutText.map((text) => (
          <Row>
            <p>{text.text}</p>
          </Row>
        ))}
        <Row>
          <h3 className="pt-2">Partners</h3>
          {partners.map((p) => (
            <Col md="auto" key={p.name} className='pt-2'>
              <Button
                variant="outline-secondary"
                size="lg"
                href={p.link}
                target="_blank"
                className='partner-buttons'
              >
                {p.name}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </Fade>
  );
}

export default About;
