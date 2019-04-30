import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import NoteThumbnail from '../components/NoteThumbnail';
import PageTracker from '../components/PageTracker';
import LoadingSpinner from '../components/LoadingSpinner';
import config from '../config';
import { buildQueryString } from '../libs/utils';
import './Home.sass';
import * as ReactDOM from "react-dom";

// TODO store individual notes locally
// TODO see if any code is redundant (mainly on API calls) and can be separated to helper function

// TODO preload backward
// TODO move page size out of config

const LOAD_ERR_MESSAGE = 'Failed to load note page';
const NOTES = 'notes';
const NOTE_PAGE_MAP = 'notePageMap';
const PAGE_SIZE = 'pageSize';

export default class Home extends Component {

    // TODO has localStorage for future implementation
    constructor(props) {
        super(props);

        this.noteListRef = React.createRef();

        this.pageSize = localStorage.getItem(PAGE_SIZE) || config.DEFAULT_NOTES_PAGE_SIZE;
        this.totalNumberOfNotes = 0;

        this.state = {
            isLoading: true,
            notes: localStorage.getItem(NOTES) || [],
            notePageMap: localStorage.getItem(NOTE_PAGE_MAP) || [],
            currentPage: 1
        };
    }

    async componentDidMount() {
        if(!this.props.isAuthenticated) {
            return;
        }

        try {
            const { notes, count, lastKey } = await this.fetchNotes(null, this.pageSize);

            this.totalNumberOfNotes = count;

            let newNotes = [].concat(notes.map((note, index) =>
                index === this.pageSize - 1 ?
                    { note: note, nextKey: lastKey } :
                    { note: note, nextKey: null }
            ));

            let newNotePageMap = [];
            for(let page = 1; page <= Math.ceil(count / this.pageSize); page++)
                newNotePageMap[page - 1] = {
                    page: page,
                    first: (page - 1) * this.pageSize,
                    last: Math.min(((page - 1) * this.pageSize) + this.pageSize - 1, count - 1)
                };

            this.setState({
                notes: newNotes,
                notePageMap: newNotePageMap,
                isLoading: false
            });
        } catch(err) {
            console.log(LOAD_ERR_MESSAGE);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.currentPage !== nextState.currentPage ||
            this.state.isLoading !== nextState.isLoading ||
            this.state.notePageMap.length !== nextState.notePageMap.length ||
            this.state.notes.length !== nextState.notes.length;
    }

    // TODO
    async componentDidUpdate() {
        if(this.isFetchNeeded(this.state.currentPage)) {
            const lastNote = this.state.notePageMap[this.state.currentPage - 1].last;

            console.log(this.state.notes);
            console.log(lastNote);
            const nextStartKey = this.state.notes[lastNote].nextKey;


        } else
            this.setState({ isLoading: false });

        const nodeList = ReactDOM.findDOMNode(this.noteListRef.current);
        if(nodeList.clientHeight < nodeList.scrollHeight)
            nodeList.classList.add('overflowing-ver');

        this.fetchNeighbourPages();
    }

    componentWillUnmount() {
        localStorage.setItem(PAGE_SIZE, this.pageSize);
    }

    isFetchNeeded = (pageToCheck) => {
        if(!this.state.notePageMap[pageToCheck - 1])
            return false;

        const pageInfo = this.state.notePageMap[pageToCheck - 1];
        for(let i = pageInfo.first; i <= pageInfo.last; i++)
            if(!this.state.notes[i])
                return true;

        return false;
    };

    // TODO fetch previous page
    fetchNeighbourPages = async () => {
        if(this.isFetchNeeded(this.state.currentPage  + 1)) {
            const pageInfo = this.state.notePageMap[this.state.currentPage - 1];
            const lastNote = this.state.notes[pageInfo.last];
            const { notes, lastKey } = await this.fetchNotes(lastNote.nextKey, this.pageSize);

            this.setState(oldState => {
                let newNotes = oldState.notes.slice(0);
                newNotes = newNotes.concat(notes.map((note, index) =>
                    index === this.pageSize - 1 ?
                        { note: note, nextKey: lastKey } :
                        { note: note, nextKey: null }
                ));

                return { notes: newNotes };
            });
        }
    };

    previousPage = () => {
        if(this.state.currentPage !== 1) {
            this.setState(currentState => {
                return {
                    isLoading: this.isFetchNeeded(this.state.currentPage - 1),
                    currentPage: currentState.currentPage - 1
                }
            })
        }
    };

    nextPage = async () => {
        if(this.state.currentPage < this.state.notePageMap.length) {
            this.setState(currentState => {
                return {
                    isLoading: this.isFetchNeeded(this.state.currentPage + 1),
                    currentPage: currentState.currentPage + 1
                }
            })
        }
    };

    changePageSize = (pageSize) => {
        this.pageSize = pageSize;
        let newNotePageMap = [];
        for(let page = 1; page <= Math.ceil(this.totalNumberOfNotes / this.pageSize); page++)
            newNotePageMap[page - 1] = {
                page: page,
                first: (page - 1) * this.pageSize,
                last: Math.min(((page - 1) * this.pageSize) + this.pageSize - 1, this.totalNumberOfNotes - 1)
            };

        this.setState({ notePageMap: newNotePageMap, currentPage: 1 });

        this.fetchNeighbourPages();
    };

    fetchNotes = (startKey, pageSize) => {
        const query = buildQueryString([
            { name: 'pageSize', value: pageSize },
            { name: 'start', value: JSON.stringify(startKey) }
        ]);

        return API.get('notes', '/notes' + query, {});
    };

    renderNotesList() {
        let notePage = [];
        const pageInfo = this.state.notePageMap[this.state.currentPage - 1];
        for(let i = pageInfo.first; i <= pageInfo.last; i++)
            notePage[i - pageInfo.first] = this.state.notes[i].note;

        return notePage.map(
            note => {
                const lnBreak = note.content.search('\n');

                return (
                    <LinkContainer
                        key={note.noteId}
                        to={`/notes/${note.noteId}`}>
                        <ListGroupItem className='note-thumbnail'>
                            <NoteThumbnail
                                title={note.content.substr(0, lnBreak !== -1 ? lnBreak : note.content.length)}
                                date={new Date(note.createdAt).toLocaleString()}
                                attachment={note.attachment !== null}
                            />
                        </ListGroupItem>
                    </LinkContainer>);
            }
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

    renderNotes() {
        return (
            <div className='notes'>
                <PageHeader>Your Notes</PageHeader>
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
                <ListGroup className='note-list scrollable-ver' ref={this.noteListRef}>
                    {!this.state.isLoading && this.renderNotesList()}
                </ListGroup>
                {!this.state.isLoading && <PageTracker
                    currentPage={this.state.currentPage}
                    numberOfPages={this.state.notePageMap.length}
                    previousPage={this.previousPage}
                    nextPage={this.nextPage}
                    changePageSize={this.changePageSize}
                />}
                {this.state.isLoading && <LoadingSpinner color='primary-dark'/>}
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
