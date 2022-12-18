import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../../firebase';

function Login() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showFPModal, setShowFPModal] = useState(false);

  const handleCloseFPModal = () => setShowFPModal(false);
  const handleShowFPModal = () => setShowFPModal(true);


  const logInAdmin = (e, email, password) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
      // Signed in
      navigate('/admin');
      sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Unable to log in: ' + errorMessage); // Fix to show up in form instead of as alert
      console.log(errorCode);
    });
  };

  // Forgot password email
  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  // useEffect(() => {
  //   if (sessionStorage.getItem('Auth Token')) {
  //     navigate('/admin');
  //   }
  // }, []);

  return (
    <Fade in={open}>
      <Container className="mt-5 pt-5">
        <h2>Admin Login</h2>
        <Card>
          <Card.Body className="text-bg-light">
            <Card.Title>Login</Card.Title>
            <Form>
              <Form.Group className="mb-3" controlId="adminLoginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="adminLoginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <Form.Text><Button variant='link' onClick={handleShowFPModal}>Forgot Password?</Button></Form.Text> */}
              </Form.Group>
              <Button variant="primary" type="submit" onClick={(e) => logInAdmin(e, email, password)}>
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Modal show={showFPModal} onHide={handleCloseFPModal}>
          <Modal.Header closeButton>
            <Modal.Title>Forgot Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>password reset stuff here</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFPModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCloseFPModal}>
              Reset Password
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fade>
  );
}

export default Login;
