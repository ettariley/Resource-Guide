import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
// import { mockAboutText, mockAboutPartners } from '../mock-data';
import { db } from '../../firebase';
import { query, doc, getDoc } from 'firebase/firestore';
import './about.css';

function About() {
  const [open, setOpen] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showOfflineNoCacheToast, setShowOfflineNoCacheToast] = useState(false);
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
          localStorage.setItem(
            'aboutFeaturedText',
            JSON.stringify(aboutTextSnapshot.data().text)
          );
          // console.log(aboutText);
        }
      );
    } else {
      if (localStorage.getItem('aboutFeaturedText') !== []) {
        const localFeaturedText = JSON.parse(localStorage.getItem('aboutFeaturedText'));
        setAboutText(localFeaturedText);
        console.log(aboutText);
      } else {
        setShowOfflineNoCacheToast(true);
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
          localStorage.setItem(
            'aboutPartners',
            JSON.stringify(partnersQuerySnapshot.data().partners)
          );
        }
      );
    } else {
      if (localStorage.getItem('aboutPartners') !== []) {
        const localPartners = JSON.parse(localStorage.getItem('aboutPartners'));
        setPartners(localPartners);
        console.log(partners);
        setShowOfflineToast(true);
      } else {
        setShowOfflineNoCacheToast(true);
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
        {/* Offline warning Toast */}
        <ToastContainer className="p-3" position="top-end">
          <Toast
            onClose={() => setShowOfflineToast(false)}
            show={showOfflineToast}
            delay={3000}
            autohide
            bg="secondary"
          >
            <Toast.Header>
              <strong className="me-auto">Offline</strong>
            </Toast.Header>
            <Toast.Body>
              You are offline. Until you are online, you may not be viewing the
              most updated information, and some parts of the page may not work.
            </Toast.Body>
          </Toast>
        </ToastContainer>
        {/* Offline no cache warning Toast */}
        <ToastContainer className="p-3" position="top-end">
          <Toast
            onClose={() => setShowOfflineNoCacheToast(false)}
            show={showOfflineNoCacheToast}
            delay={3000}
            autohide
            bg="secondary"
          >
            <Toast.Header>
              <strong className="me-auto">Offline - No Data</strong>
            </Toast.Header>
            <Toast.Body>
              You are offline and no data can be loaded. Please connect to the
              internet to use this page.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </Fade>
  );
}

export default About;
