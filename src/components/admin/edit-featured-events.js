import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Form from 'react-bootstrap/Form';
import { db } from '../../firebase';
import { query, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './admin.css';

function EditFeaturedEvents() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [display, setDisplay] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [editingText, setEditingText] = useState('');

  const eventsTextDocRef = doc(db, 'Featured-Texts', 'EventsPage');

  const saveEdits = () => {
    updateDoc(eventsTextDocRef, {
      Text: editingText,
    }).then(() => {
      setText(editingText);
      setReadOnly(true);
    });
  };

  const cancelEdits = () => {
    setReadOnly(true);
    setEditingText('');
  };

  const editText = () => {
    setEditingText(text);
    setReadOnly(false);
  };

  const clearText = () => {
    updateDoc(eventsTextDocRef, {
      Text: '',
    }).then(() => {
      setText('');
      setEditingText('');
    });
  };

  const displayText = () => {
    updateDoc(eventsTextDocRef, {
      display: !display,
    }).then(() => {
      setDisplay(!display);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const featuredTextQuery = query(eventsTextDocRef);
    const textSnapshot = getDoc(featuredTextQuery).then((textSnapshot) => {
      setText(textSnapshot.data().Text);
      setDisplay(textSnapshot.data().display);
    });
  }, []);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Edit Events Page Featured Text</h2>
        <Row>
          {/* text box with current text */}
          <Col>
            <h4>Text</h4>
            <Form.Group className="mb-3" controlId="editFTR.text">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={text}
                value={editingText}
                readOnly={readOnly}
                onChange={(e) => setEditingText(e.target.value)}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="secondary"
              className="me-2"
              disabled={readOnly}
              onClick={(e) => saveEdits(e)}
            >
              Save Edits
            </Button>
            <Button
              variant="danger"
              onClick={() => cancelEdits()}
              disabled={readOnly}
            >
              Cancel Edits
            </Button>
          </Col>
          {/* options */}
          <Col>
            <h4>Options</h4>
            <Button
              variant="outline-white"
              className="mb-1"
              onClick={() => editText()}
            >
              Edit Text
            </Button>
            <br></br>
            <Button variant="outline-white" className="mb-1" onClick={() => clearText()}>
              Clear Text (Action Cannot be Undone)
            </Button>
            <Row className="ps-4 pt-1">
              <Form.Switch
                label="Display text on page?"
                checked={display}
                onChange={() => displayText()}
              />
            </Row>
          </Col>
        </Row>
        {/* Return to admin dashboard button */}
        <Row className="mt-4 mb-2">
          <Col className="ps-0">
            <Button variant="outline-light" size="sm" as={Link} to="/admin">
              <i className="bi bi-arrow-left"></i> Back to Admin Dashboard
            </Button>
          </Col>
        </Row>
      </Container>
    </Fade>
  );
}

export default EditFeaturedEvents;
