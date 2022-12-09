import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SuccessModal(props) {
  const { showSuccessModal, handleCloseSuccessModal } = props;

  return (
    <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
      <Modal.Header closeButton>
        <Modal.Title className="text-bg-light">Request Submitted</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-bg-light">
        Your request has been sent to our admin.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseSuccessModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
)
}

export default SuccessModal;