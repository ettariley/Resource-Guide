import React, { useEffect, useRef, useState } from 'react';
import Fade from 'react-bootstrap/Fade';
import Container from 'react-bootstrap/Container';

function Admin() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(true);
  }, []);

  return (
    <Fade in={open}>
      <Container className='mt-5 pt-5'>
        <h2>Admin Page</h2>
      </Container>
    </Fade>
  )
}

export default Admin;