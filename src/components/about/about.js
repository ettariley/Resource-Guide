import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
// import { mockAboutText, mockAboutPartners } from '../mock-data';
import { db } from '../../firebase';
import {
  query,
  doc,
  getDoc,
} from 'firebase/firestore';
import './about.css';

function About() {
  const [open, setOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [aboutText, setAboutText] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  // set featured text
  useEffect(() => {
    if (navigator.onLine) {
      const aboutTextQuery = query(doc(db, 'About-Page', 'AboutText'));
      const aboutTextSnapshot = getDoc(aboutTextQuery).then(
        (aboutTextSnapshot) => {
          setAboutText(aboutTextSnapshot.data().text);
          localStorage.setItem('aboutFeaturedText', JSON.stringify(aboutTextSnapshot.data().text));
          // console.log(aboutText);
        }
      );
    } else {
      if (localStorage.getItem('aboutFeaturedText') !== '') {
        setAboutText(JSON.parse(localStorage.getItem('aboutFeaturedText')));
      } else {
        alert("No internet connection; can't load featured text.");
      }
    } 
  }, []);

  // set about partners
  useEffect(() => {
    if (navigator.onLine) {
      const partnersQuery = query(doc(db, 'About-Page', 'AboutPartners'));
      const partnersQuerySnapshot = getDoc(partnersQuery).then(
        (partnersQuerySnapshot) => {
          setPartners(partnersQuerySnapshot.data().partners);
          localStorage.setItem('aboutPartners', JSON.stringify(partners));
        }
      );
    } else {
      if (localStorage.getItem('aboutPartners')) {
        setAboutText(JSON.parse(localStorage.getItem('aboutPartners')));
      } else {
        alert("No internet connection; can't load partners.");
      }
    } 
    
  }, []);

  return (
    <Fade in={open}>
      <Container className="about">
        <h2>About</h2>
        {aboutText.map((text) => (
          <Row>
            <p>{text}</p>
          </Row>
        ))}
        <Row>
          <h3 className="pt-2">Partners</h3>
          {partners.map((p) => (
            <Col md="auto" key={p.name} className="pt-2">
              <Button
                variant="outline-secondary"
                size="lg"
                href={p.website}
                target="_blank"
                className="partner-buttons"
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
