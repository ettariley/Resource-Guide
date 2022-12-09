import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';


function Login(props) {
  const [open, setOpen] = useState(false);
  const { loggedIn, setLoggedIn } = props;
  const navigate = useNavigate();

  const logInAdmin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    localStorage.setItem("loggedIn", true);
    navigate("/admin");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('loggedIn')) {
      navigate('/admin');
    }
  }, []);

  return (
    <Fade in={open}>
      <Container className='mt-5 pt-5'>
        <h2>Admin Login</h2>
        <Card>
          <Card.Body className="text-bg-light">
            <Card.Title>Login</Card.Title>
            <Form>
              <Form.Group className="mb-3" controlId="adminLoginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" disabled/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="adminLoginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" disabled/>
              </Form.Group>
              <Button variant="primary" type="submit" onClick={logInAdmin}>
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fade>
  )
}

export default Login;