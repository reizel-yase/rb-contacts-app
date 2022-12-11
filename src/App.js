import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import './App.css';

const App = () => {
    return <Router>
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="/">
                    <FontAwesomeIcon icon={faAddressBook} /> Contacts
                </Navbar.Brand>    
            </Container>
        </Navbar>
        <div className="contentArea">
            <Container>
                <Row>
                    <Col sm="10">
                        <Routes>
                            <Route path="/" element={<ContactList />} />
                            <Route path="/contact" element={<ContactForm />}>
                                <Route path=":contactId" element={<ContactForm />} />
                            </Route>                            
                        </Routes>
                    </Col>
                </Row>
            </Container>
        </div>
    </Router>
}

export default App;
