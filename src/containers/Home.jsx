import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import NoteThumbnail from '../components/NoteThumbnail';
import PageTracker from '../components/PageTracker';
import Link from 'react-router-dom/es/Link';
import config from '../config';
import { buildQueryString } from '../libs/utils';
import './Home.sass';

// TODO store note list locally so we don't call the API every time we need it

// TODO preload backward
// TODO move page size out of config

const LOAD_ERR_MESSAGE = 'Failed to load note page';

export default class Home extends Component {

    constructor(props) {
        super(props);

        // This will store the notes and the startKey to the next page
        this.numberOfPages = 0;

        this.state = {
            isLoading: true,
            notes: [{}],
            currentPage: 1
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.currentPage !== nextState.currentPage ||
            (this.state.isLoading !== nextState.isLoading);
    }

    async componentDidUpdate() {
        if(this.isFetchNeeded(this.state.currentPage))
            Home.getNotes(this.state.notes[this.state.currentPage - 1].nextStartKey).then(
                response => {
                    this.setState(oldState => {
                        let currentNotes = oldState.notes.slice(0);
                        currentNotes[oldState.currentPage] = {
                            noteList: response.notes,
                            nextStartKey: response.lastKey
                        };

                        return {
                            notes: currentNotes,
                            isLoading: false
                        }
                    });
                },
                // TODO better error handling
                () => console.log('Failed to fetch next page of notes.')
            );
        else
            this.setState({ isLoading: false });

        this.fetchNeighbourPages();
    }

    async componentDidMount() {
        if(!this.props.isAuthenticated) {
            return;
        }

        try {
            const response = await Home.getNotes(null);
            this.numberOfPages = response.count % config.NOTES_PAGE_SIZE === 0 ?
                response.count / config.NOTES_PAGE_SIZE :
                response.count / config.NOTES_PAGE_SIZE + 1;

            this.setState(oldState => {
                let currentNotes = oldState.notes.slice(0);
                currentNotes[oldState.currentPage] = {
                    noteList: response.notes,
                    nextStartKey: response.lastKey
                };

                return {
                    notes: currentNotes,
                    isLoading: false
                }
            });
        } catch(err) {
            console.log(LOAD_ERR_MESSAGE);
            console.log(err);

            this.setState({ isLoading: false });
        }
    }

    fetchNeighbourPages = () => {
        if(this.isFetchNeeded(this.state.currentPage  + 1))
            Home.getNotes(this.state.notes[this.state.currentPage].nextStartKey).then(
                response => this.setState(currentState => {
                    let currentNotes = currentState.notes.slice(0);
                    currentNotes[currentState.currentPage + 1] = {
                        noteList: response.notes,
                        nextStartKey: response.lastKey
                    };

                    return {
                        notes: currentNotes
                    }
                })
            );
    };

    static async getNotes(startKey) {
        const query = buildQueryString([
            { name: 'pageSize', value: config.NOTES_PAGE_SIZE},
            { name: 'start', value: JSON.stringify(startKey) }
        ]);

        return API.get('notes', '/notes' + query, {});
    }

    renderNotesList() {
        return [].concat(this.state.notes[this.state.currentPage].noteList).map(
            note =>
                <Link
                    key={note.noteId}
                    to={`/notes/${note.noteId}`}>
                    <NoteThumbnail title={note.content.trim().split("\n")[0]}
                                   date={new Date(note.createdAt).toLocaleString()}
                                   attachment={note.attachment}/>
                </Link>
        );
    };

    static renderLander() {
        return (
            <div className='lander'>
                <h1>NoteIt</h1>
                <p>NoteIt is a simple app, developed by Simply, where you can take notes, attach files to them, and check them whenever you want,
                    delete them, or even edit them, all through your account.</p>
            </div>
        );
    };

    isFetchNeeded(pageToCheck) {
        return !this.state.notes[pageToCheck] && pageToCheck <= this.numberOfPages && pageToCheck >= 1;
    }

    previousPage = () => {
        if(this.state.currentPage !== 1) {
            if(this.isFetchNeeded(this.state.currentPage - 1))
                this.setState(currentState => {
                    return {
                        isLoading: true,
                        currentPage: currentState.currentPage - 1
                    }
                });
            else
                this.setState({ currentPage: this.state.currentPage - 1 });
        }
    };

    nextPage = async () => {
        if(this.state.currentPage !== this.numberOfPages) {
            if(this.isFetchNeeded(this.state.currentPage + 1))
                this.setState(currentState => {
                    return {
                        isLoading: true,
                        currentPage: currentState.currentPage + 1
                    }
                });
            else
                this.setState({ currentPage: this.state.currentPage + 1 });
        }
    };

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
                    {!this.state.isLoading && this.renderNotesList()}
                </ListGroup>
                {!this.state.isLoading && <PageTracker
                    currentPage={this.state.currentPage}
                    numberOfPages={this.numberOfPages}
                    previousPage={this.previousPage}
                    nextPage={this.nextPage}
                />}
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
