import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCircleInfo, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const ContactList = () => {
    const [searchKey, setSearchKey] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [deleteContactId, setDeleteContactId] = useState()
    const storedContacts = useMemo(() => localStorage.getItem("contacts") ? JSON.parse(localStorage.getItem("contacts")) : [], [localStorage])
    const filteredContacts = useMemo(() => {
        if (searchKey) {
            return storedContacts.filter(contact => Object.values(contact).map(val => val.toLowerCase()).join(" ").includes(searchKey.toLowerCase()))
        }

        return storedContacts
    }, [storedContacts, searchKey])
    const contacts = useMemo(() => searchKey ? filteredContacts : storedContacts, [searchKey, storedContacts, filteredContacts])

    const removeStoredContact = () => {
        let newContacts = storedContacts
        const savedContactIndex = storedContacts.findIndex(c => c.id === deleteContactId)

        if (savedContactIndex > -1) {
            newContacts.splice(savedContactIndex, 1)

            localStorage.setItem("contacts", JSON.stringify(newContacts))
        }

        setShowModal(false)
    }

    const deleteContact = contactId => {
        setDeleteContactId(contactId)
        setShowModal(true)
    }

    const InfoText = ({ text, variant }) => <Alert variant={variant}>
        <FontAwesomeIcon icon={faCircleInfo} /> { text }
    </Alert>

    return <>
        <Row>
            <Form as={Col} sm="6">
                <Row>
                    <Form.Group as={Col} sm="8">
                        <Form.Control type="search" placeholder="Search contacts" mr="sm-2" value={searchKey} onChange={e => setSearchKey(e.currentTarget.value)} />
                    </Form.Group>    
                </Row>                
            </Form>
            <Col sm="3 offset-3" xs="4">
                <div  className="justify-content-end d-flex">
                    <Button variant="success" as="a" href="/contact"><FontAwesomeIcon icon={faPlus} /> New Contact</Button>
                </div>
            </Col>
        </Row>
        <Row>
            <Col sm="12">
            {
                (storedContacts.length && (!searchKey || (searchKey && filteredContacts.length))) ? 
                contacts.map((contact, i) => <Card 
                    key={i}>
                    <Card.Body>
                        <Row>
                            <Col sm="6">
                                <Card.Title>{ contact.name }</Card.Title>
                                <Card.Subtitle>{ contact.phone }</Card.Subtitle>
                                <Card.Text>{ contact.email }</Card.Text>
                            </Col>
                            <Col sm="3 offset-3" className="align-items-center justify-content-end d-flex">
                                <div>
                                    <Button variant="light" className="btn-outline-danger" onClick={() => deleteContact(contact.id)}><FontAwesomeIcon icon={faTrashCan} /> Delete</Button>  <Button variant="warning" type="submit" as="a" href={`/contact/${contact.id}`}><FontAwesomeIcon icon={faPenToSquare} /> Edit</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>) :
                <InfoText 
                    text={storedContacts.length && searchKey && !filteredContacts.length ? "No matches found." : "You have no contacts currently."} 
                    variant={ storedContacts.length && searchKey && !filteredContacts.length ? "danger" : "info"}
                />   
            }
            </Col>
        </Row>
        <Modal show={showModal}>
            <Modal.Dialog>
            <Modal.Body>
                        Are you sure you want to delete the contact ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => removeStoredContact()}>OK</Button>
                    </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    </>
}

export default ContactList;