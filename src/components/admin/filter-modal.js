import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap';
// import { useAtom } from 'jotai';
// import {
//   programFiltersAtom,
//   currentFilterListAtom,
//   currentFilterTypeAtom,
//   newListItemAtom
// } from '../../atoms';

function FilterModal(props) {
  const { showFilterModal, handleCloseFilterModal } = props;
  // const [newListItem, setNewListItem] = useAtom(newListItemAtom);
  // const [programFilters, setProgramFilters] = useAtom(programFiltersAtom);
  // const [filterList, setFilterList] = useAtom(currentFilterListAtom);
  // const [filterType, setFilterType] = useAtom(currentFilterTypeAtom);

  const deleteListItem = () => {
    alert("Item isn't really deleted yet.");
  };

  // const updateList = (e) => {
  //   console.log(newListItem);
  //   e.preventDefault();
  //   setFilterList([...filterList, newListItem]);
  //   if (filterType === 'Programs') {
  //     setProgramFilters([...filterList]);
  //   }
  //   console.log(filterList);
  //   console.log(programFilters);
  //   setNewListItem('');
  // };

  // const closeAndClear = () => {
  //   setNewListItem('');
  //   handleCloseFilterModal();
  // };

  return (
    <Row>
      
    </Row>
    // <Modal show={showFilterModal} onHide={closeAndClear}>
    //   <Modal.Header closeButton>
    //     <Modal.Title className="text-bg-light">
    //       Edit {filterType} List
    //     </Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     <ListGroup variant="flush">
    //       {filterList.map((f) => (
    //         <ListGroup.Item className="d-flex justify-content-between align-items-end">
    //           {f}
    //           <Button variant="link" onClick={deleteListItem} className="p-0">
    //             <i className="bi bi-trash3-fill"></i>
    //           </Button>
    //         </ListGroup.Item>
    //       ))}
    //       <ListGroup.Item>
    //         <Row>
    //           <Col>
    //             <Form.Control
    //               type="text"
    //               placeholder="Add to List"
    //               value={newListItem}
    //               onChange={(e) => setNewListItem(e.target.value)}
    //             />
    //           </Col>
    //           {newListItem !== '' ? (
    //             <Col sm="auto">
    //               <Button
    //                 variant="primary"
    //                 type="submit"
    //                 className="ms-auto"
    //                 onClick={updateList}
    //               >
    //                 Submit
    //               </Button>
    //             </Col>
    //           ) : null}
    //         </Row>
    //       </ListGroup.Item>
    //     </ListGroup>
    //   </Modal.Body>
    //   <Modal.Footer>
    //     <Button variant="secondary" onClick={closeAndClear}>
    //       Close
    //     </Button>
    //   </Modal.Footer>
    // </Modal>
  );
}

export default FilterModal;
