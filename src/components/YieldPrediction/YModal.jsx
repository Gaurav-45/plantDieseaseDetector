import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './YModal.css'; // Import the CSS file

function YModal({ showInfo, setShowInfo, cropInfo }) {

    return (
        <Modal
            show={showInfo}
            onHide={() => setShowInfo(false)}
            dialogClassName="custom-modal"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header>
                <Modal.Title id="example-custom-modal-styling-title">
                    How to grow {cropInfo.crop_name}
                </Modal.Title>
                <Button className="custom-close-button" onClick={() => setShowInfo(false)}>x</Button>
            </Modal.Header>
            <Modal.Body>
                {cropInfo?.growing_steps?.map((growing_step, key) => (
                    <div key={key}>
                        <p>{growing_step.name}</p>
                        <ul>
                            {growing_step.steps.map((step, key) => (
                                <li key={key}>{step}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </Modal.Body>
        </Modal>
    );
}

export default YModal;