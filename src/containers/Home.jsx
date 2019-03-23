import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { LinkContainer } from "react-router-bootstrap";
import './Home.css';

//TODO store note list locally so we don't call the API everytime we need it
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const notes = await Home.notes();
            this.setState({ notes });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

     static notes() {
        return API.get('notes', '/notes', {});
    }

    //TODO create separate class for note row?
    //TODO create small indicator for wether note has attachment (with name?)
    static renderNotesList(notes) {

        /**
         * Needed because WebStorm warns about properties that it doesn't recognize
         * @param note
         * @param note.noteId
         * @param note.createdAt
         */
        return [{}].concat(notes).map(
            (note, i) =>
                i !== 0
                    ? <LinkContainer
                        key={note.noteId}
                        to={`/notes/${note.noteId}`}
                    >
                        <ListGroupItem header={note.content.trim().split("\n")[0]}>
                            {"Created: " + new Date(note.createdAt).toLocaleString()}
                        </ListGroupItem>
                    </LinkContainer>
                    : <LinkContainer
                        key="new"
                        to="/notes/new"
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new note
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
        );
    }

    static renderLander() {
        return (
            <div className='lander'>
                <h1>NoteIt</h1>
                <p>A simple note taking app</p>
            </div>
        );
    }

    renderNotes() {
        return (
            <div className='notes'>
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && Home.renderNotesList(this.state.notes)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className='Home'>
                {this.props.isAuthenticated ? this.renderNotes() : Home.renderLander()}
            </div>
        );
    }
}
