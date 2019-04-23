import React, { Component } from 'react';
import {
    HelpBlock,
    Form,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import ConditionalHelpBlock from '../components/ConditionalHelpBlock';
import { Auth } from 'aws-amplify';
import './SignUp.sass';
import '../index.sass';

// TODO give more feedback on why sign up button is disabled
export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: '',
            password: '',
            confirmPassword: '',
            confirmationCode: '',
            newUser: null
        };
    }

    validateForm() {
        return this.validateEmail() && this.validatePasswordDigit() &&
            this.validatePasswordLowerCase() && this.validatePasswordUpperCase() &&
            this.validatePasswordLength()
            && this.state.password === this.state.confirmPassword;
    }

    validateEmail() {
        return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/.test(this.state.email.toUpperCase());
    }

    validatePasswordDigit() {
        return /(?=.*\d)/.test(this.state.password) || this.state.password.length === 0;
    }

    validatePasswordLowerCase() {
        return /(?=.*[a-z])/.test(this.state.password) || this.state.password.length === 0;
    }

    validatePasswordUpperCase() {
        return /(?=.*[A-Z])/.test(this.state.password) || this.state.password.length === 0;
    }

    validatePasswordLength() {
        console.log(this.state.password.length);
        console.log(/.{8,}/.test(this.state.password));

        return /.{8,}/.test(this.state.password) || this.state.password.length === 0;
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });
            this.setState({
                newUser
            });
        } catch (e) {
            alert(e.message);
        }

        this.setState({ isLoading: false });
    };

    // TODO Handle use case: user signed up but didn't confirm account (and wants to sign in)
    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    };

    renderConfirmationForm() {
        return (
            <Form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId='confirmationCode' bsSize='large'>
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type='tel'
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize='large'
                    disabled={!this.validateConfirmationForm()}
                    type='submit'
                    isLoading={this.state.isLoading}
                    text='Verify'
                    loadingText='Verifying…'
                />
            </Form>
        );
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup controlId='email' bsSize='large'>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type='email'
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId='password' bsSize='large'>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={this.state.password}
                        onChange={this.handleChange}
                        type='password'
                    />
                    <ConditionalHelpBlock className='warning'
                                          condition={!this.validatePasswordLength()}
                                          content='Your password must be 8-16 characters long!'/>
                    <ConditionalHelpBlock className='warning'
                                          condition={!this.validatePasswordUpperCase()}
                                          content='Your password must contain at least 1 uppercase letter!'/>
                    <ConditionalHelpBlock className='warning'
                                          condition={!this.validatePasswordLowerCase()}
                                          content='Your password must contain at least 1 lowercase letter!!'/>
                    <ConditionalHelpBlock className='warning'
                                          condition={!this.validatePasswordDigit()}
                                          content='Your password must contain at least 1 digit!'/>
                </FormGroup>
                <FormGroup controlId='confirmPassword' bsSize='large'>
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        type='password'
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize='large'
                    disabled={!this.validateForm()}
                    type='submit'
                    isLoading={this.state.isLoading}
                    text='Signup'
                    loadingText='Signing up…'
                />
            </Form>
        );
    }

    render() {
        return (
            <div className='Signup'>
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}
