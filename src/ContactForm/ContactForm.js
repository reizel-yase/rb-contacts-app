import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, Row, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';

const ContactForm = () => {
    const navigate = useNavigate();
    const params = useParams()
    const contactId = params.contactId  
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [showModal, setShowModal] = useState(false)
    const contacts = useMemo(() => localStorage.getItem("contacts") ? JSON.parse(localStorage.getItem("contacts")) : [], [localStorage])
    const hasChanges = useMemo(() => {
        if (contactId) {
            console.log(contactId)
            const savedContact = contacts.find(c => c.id === contactId)

            return !(name === savedContact.name && email === savedContact.email && phone === savedContact.phone)
        } else {
            return !!(name && phone && email)
        }
    }, [name, email, phone, contactId, contacts])

    const saveContact = event => {    
        event.preventDefault()

        const allContactEmails = contacts.map(contact => contact.email.toLowerCase())
        const allContactPhones = contacts.map(contact => contact.phone)
        const isDuplicate = allContactEmails.includes(email.toLowerCase()) || allContactPhones.includes(phone)

        if (isDuplicate) {
            setShowModal(true)
        } else {
            const newContacts = [
                ...contacts,
                {
                    name,
                    email,
                    phone,
                    id: uuid()
                }
            ]
    
            localStorage.setItem("contacts", JSON.stringify(newContacts))
    
            navigate("/")
        }
    }

    useEffect(() => {
        if (contacts && contactId) {
            const savedContact = contacts.find(c => c.id === contactId)

            if (savedContact) {
                setName(savedContact.name)
                setEmail(savedContact.email)
                setPhone(savedContact.phone)
            }
        }
    }, [contactId, contacts])
    
    return <>
        <Card>
            <Card.Body>
                <Form onSubmit={saveContact}>
                    <Form.Group as={Col} sm="12">
                        <Row>
                            <Form.Label as={Col} sm="2" htmlFor="staticEmail">Full Name *</Form.Label>
                            <Col sm="10">
                                <Form.Control name="name" placeholder="Name" value={name} onChange={e => setName(e.currentTarget.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} sm="12">
                        <Row>
                            <Form.Label as={Col} sm="2" htmlFor="inputPassword">Email</Form.Label>
                            <Col sm="10">
                                <Form.Control type="email" email="email" placeholder="Email" value={email} onChange={e => setEmail(e.currentTarget.value)} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} sm="12">    
                        <Row>
                            <Form.Label  as={Col} sm="2" htmlFor="inputPassword">Telephone</Form.Label>
                            <Col sm="10">
                                <Form.Control type="number" name="phone" placeholder="Telephone" value={phone}  onChange={e => setPhone(e.currentTarget.value)} />
                            </Col>
                        </Row>
                        <Row className="justify-mid-right">
                            
                        </Row>
                    </Form.Group>
                    <Form.Group as={Col} sm="12" className="align-items-center justify-content-end d-flex">
                        <div>
                            <Button variant="light" className="btn-outline-danger" as="a" href="/"><FontAwesomeIcon icon={faXmark} /> Cancel</Button>  <Button variant="success" type="submit" disabled={!hasChanges}><FontAwesomeIcon icon={faFloppyDisk} /> Save</Button>
                        </div>                    
                    </Form.Group>
                </Form>
            </Card.Body>        
        </Card>
        <Modal show={showModal}>
            <Modal.Dialog>
                <Modal.Body>
                    <p>Another contact has the same phone or email. Please edit existing contact.</p>
                    <div className="align-items-right justify-content-end d-flex">
                        <Button variant="primary" onClick={() => setShowModal(false)}>OK</Button>
                    </div>
                </Modal.Body>
            </Modal.Dialog>
        </Modal>
    </>
}

export default ContactForm;