import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import './App.sass';
import Routes from './Routes';
import Background from './components/Background';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import BellIcon from 'react-bell-icon';
import { Button, OverlayTrigger, ButtonToolbar, Popover  } from 'react-bootstrap'


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            newNotification: false,
            unRead: []
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

    receiveNotification = () => {
        this.setState({newNotification : true})
        setTimeout(() => this.setState({newNotification : false}), 2000)
        this.state.unRead.push(1)
    } 

    readAll = () => {
        this.setState({unRead : []})
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            <>
                <Button onClick={() => this.receiveNotification()}> Receber notificação</Button>
                <Background/>
                {!this.state.isAuthenticating &&
                <div className="App container">
                    <Navbar fluid collapseOnSelect>
                        <Navbar.Header>
                        {this.state.isAuthenticated &&
                            <Navbar.Brand>
                                <ButtonToolbar>
                                    <OverlayTrigger trigger="click" key="bottom" placement="bottom"  overlay={
                                        <Popover id={'popover-positioned-bottom'} title={'Notifications'} >
                                        Teste
                                        </Popover>
                                    }>
                                    <BellIcon onClick={() =>this.readAll()} color="#FFAE00" active={this.state.unRead.length>0} animate={this.state.newNotification}/>
                                    </OverlayTrigger>
                                </ButtonToolbar>
                                <div>{this.state.unRead.length}</div>
                            </Navbar.Brand>}
                            <Navbar.Brand>
                                <Link to="/">NoteIt</Link>
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
                    <Routes childProps={childProps}/>
                </div>}
            </>
        );
    }
}

export default withRouter(App);