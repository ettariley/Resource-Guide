import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
// import { mockAboutText, mockAboutPartners } from '../mock-data';
import { db } from '../../firebase';
import {
  query,
  orderBy,
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
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

  useEffect(() => {
    const aboutTextQuery = query(doc(db, 'About-Page', 'AboutText'));
    const aboutTextSnapshot = getDoc(aboutTextQuery).then(
      (aboutTextSnapshot) => {
        setAboutText(aboutTextSnapshot.data().text);
        console.log(aboutText);
      }
    );
  }, []);

  useEffect(() => {
    const partnersQuery = query(doc(db, 'About-Page', 'AboutPartners'));
    const partnersQuerySnapshot = getDoc(partnersQuery).then(
      (partnersQuerySnapshot) => {
        setPartners(partnersQuerySnapshot.data().partners);
      }
    );
  }, []);

  return (
    <Fade in={open}>
      <Container className="about">
        <h2>About</h2>
        {/* as rows */}
        {/* {aboutText.map((text) => (
          <Row>
            <p>{text.text}</p>
          </Row>
        ))} */}
        {aboutText.map((text) => (
          <Row>
            <p>{text}</p>
          </Row>
        ))}
        {/* <Row>{aboutText}</Row> */}
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
