import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true
        };
    }

    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.userHasAuthenticated(true);
        } catch(e) {
            if(e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({ isAuthenticating: false });
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    handleLogout = async () => {
        await Auth.signOut();

        this.userHasAuthenticated(false);
        this.props.history.push('/login');
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App container">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Scratch</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ? <>
                                    <LinkContainer to="/settings">
                                        <NavItem>Settings</NavItem>
                                    </LinkContainer>
                                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                </>
                                : <>
                                    <LinkContainer to="/signup">
                                        <NavItem>Signup</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps} />
            </div>
        );
    }
}

export default withRouter(App);