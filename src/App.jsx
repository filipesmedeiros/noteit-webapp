import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import {LinkContainer} from 'react-router-bootstrap';

class App extends Component {
    render() {
        return (
            <div className='App container'>
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to='/'>Scratch</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <LinkContainer to='login'>
                                <NavItem>Log In</NavItem>
                            </LinkContainer>
                            <LinkContainer to='/signup'>
                                <NavItem>Sign Up</NavItem>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes />
            </div>
        );
    }
}

export default App;