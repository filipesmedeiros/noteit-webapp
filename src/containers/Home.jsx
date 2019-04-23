import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { LinkContainer } from "react-router-bootstrap";
import NoteThumbnail from "../components/NoteThumbnail";
import './Home.sass';
import Link from "react-router-dom/es/Link";

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

    static renderNotesList(notes) {
        /**
         * Needed because WebStorm warns about properties that it doesn't recognize
         * @var note
         * @property note.noteId
         * @property note.createdAt
         */
        return [].concat(notes).map(
            note =>
                <Link
                    key={note.noteId}
                    to={`/notes/${note.noteId}`}>
                    <NoteThumbnail title={note.content.trim().split("\n")[0]}
                                   date={new Date(note.createdAt).toLocaleString()}
                                   attachment={note.attachment}/>
                </Link>
        );
    }

    static renderLander() {
        return (
            <div className='lander'>
                <h1>NoteIt</h1>
                <p>NoteIt is a simple app, developed by Simply, where you can take notes,<br/>attach files to them, and check them whenever you want,
                    delete them, or even edit them, all through your account.</p>
            </div>
        );
    }

    renderNotes() {
        return (
            <div className='notes'>
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    <LinkContainer
                        key='new'
                        to='/notes/new'
                    >
                        <ListGroupItem className='create-note-row'>
                            <h4>
                                <b>{'\uFF0B'}</b> Create a new note
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
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
