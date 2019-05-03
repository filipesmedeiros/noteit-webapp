import React, { Component } from 'react';
import { PageHeader, ListGroupItem } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import NoteThumbnail from '../components/NoteThumbnail';
import InfiniteScroll from '../components/InfiniteScroll';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemPage from "../components/ItemPage";
import config from '../config';
import { buildQueryString } from '../libs/utils';
import './Home.sass';
import Button from "react-bootstrap/es/Button";

// TODO store individual notes locally
// TODO remake all this to be infinite feed with option of seeing all

// TODO move page size out of config

const LOAD_ERR_MESSAGE = 'Failed to load note page';
const NOTES = 'notes';
const IS_INFINITE = 'isInfinite';
const PAGE_SIZE = 'pageSize';

const MAX_TITLE_LENGTH = 10;

export default class Home extends Component {

    // TODO has localStorage for future implementation
    constructor(props) {
        super(props);

        this.noteListRef = React.createRef();

        this.pageSize = localStorage.getItem(PAGE_SIZE) || config.DEFAULT_NOTES_PAGE_SIZE;
        this.lastFetchHadNext = true;

        this.state = {
            isLoading: true,
            isFetchingNotes: false,
            notes: localStorage.getItem(NOTES) || [],
            infiniteViewMode: localStorage.getItem(IS_INFINITE) || true,
            currentPage: 1,
            counter: 0
        };
    }

    async componentDidMount() {
        if(!this.props.isAuthenticated) {
            return;
        }

        try {
            const { notes, count, lastKey } = await this.fetchNotes(null, config.INITIAL_NOTE_FETCH_SIZE);

            this.totalNumberOfNotes = count;

            let newNotes = [].concat(notes.map((note, index) =>
                index === config.INITIAL_NOTE_FETCH_SIZE - 1 ?
                    { note: note, nextKey: lastKey || null } :
                    { note: note, nextKey: null }
            ));

            let newNotePageMap = [];
            for(let page = 1; page <= Math.ceil(count / this.pageSize); page++) {
                newNotePageMap[page - 1] = {
                    page: page,
                    first: (page - 1) * this.pageSize,
                    last: Math.min(((page - 1) * this.pageSize) + (this.pageSize - 1), count - 1)
                };
            }

            this.lastFetchHadNext = !!lastKey;

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
            this.state.isFetchingNotes !== nextState.isFetchingNotes ||
            this.state.notes !== nextState.notes ||
            this.state.infiniteViewMode !== nextState.infiniteViewMode ||
            this.state.counter !== nextState.counter;
    }

    // TODO
    async componentDidUpdate(prevProps, prevState) {
    }

    // TODO
    componentWillUnmount() {
    }

    // TODO
    fetchNeighbourPages = async () => {
    };

    // TODO
    previousPage = () => {
    };

    // TODO
    nextPage = async () => {
    };

    // TODO
    changePageSize = (pageSize) => {
    };

    fetchNotes = (startKey, pageSize) => {
        const query = buildQueryString([
            { name: 'pageSize', value: pageSize },
            { name: 'start', value: JSON.stringify(startKey) }
        ]);

        return API.get('notes', '/notes' + query, {});
    };

    updateNoteList = async (startKey, pageSize) => {
        try {
            let {notes, lastKey} = await this.fetchNotes(startKey, pageSize);
            let updatedNotes = this.state.notes.concat(notes.map((note, index) =>
                index === this.pageSize - 1 ?
                    {note: note, nextKey: lastKey || null} :
                    {note: note, nextKey: null}
            ));

            this.lastFetchHadNext = !!startKey;

            this.setState({
                isFetchingNotes: false,
                notes: updatedNotes
            })
        } catch(err) {
            console.log(LOAD_ERR_MESSAGE);
            this.setState({ isFetchingNotes: false });
        }
    };

    scrollNoteList = () => {
        return this.state.notes.map(
            noteObj => {
                const note = noteObj.note;
                const titleIndex = Math.min(note.content.search('\n'), MAX_TITLE_LENGTH);

                return (
                    <LinkContainer
                        key={note.noteId}
                        to={`/notes/${note.noteId}`}>
                        <ListGroupItem className='scroll-note-thumbnail note-thumbnail'>
                            <NoteThumbnail
                                scrollThumbnail={true}
                                title={note.content.substr(0, titleIndex !== -1 ? titleIndex : note.content.length)}
                                date={new Date(note.createdAt).toLocaleString()}
                                attachment={note.attachment !== null}
                            />
                        </ListGroupItem>
                    </LinkContainer>);
            }
        );
    };

    pagedNoteList = () => {
        return this.state.notes.map(
            noteObj => {
                const note = noteObj.note;
                const lnBreak = note.content.search('\n');

                return (
                    <LinkContainer
                        key={note.noteId}
                        to={`/notes/${note.noteId}`}>
                        <Button className='paged-note-thumbnail note-thumbnail'>
                            <NoteThumbnail
                                scrollThumbnail={false}
                                title={note.content.substr(0, lnBreak !== -1 ? lnBreak : note.content.length)}
                                date={new Date(note.createdAt).toLocaleString()}
                                attachment={note.attachment !== null}
                            />
                        </Button>
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

    renderNotes = () => {
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

                { this.state.infiniteViewMode ?
                    <InfiniteScroll
                        reference={this.noteListRef}
                        itemList={this.scrollNoteList()}
                        classNames={['note-list']}
                        endOfScroll={() => {
                            if(this.lastFetchHadNext) {
                                const nextStartKey = this.state.notes[this.state.notes.length - 1].nextKey;
                                if(nextStartKey) {
                                    this.setState({ isFetchingNotes: true });
                                    this.updateNoteList(nextStartKey, this.pageSize);
                                }
                            }
                        }}
                    /> :
                    <ItemPage items={ this.pagedNoteList() }/> }

                { !this.state.isLoading && !this.state.isFetchingNotes &&
                <Button className='float-right' onClick={() => this.setState({ infiniteViewMode: !this.state.infiniteViewMode })}>
                    { this.state.infiniteViewMode ?
                        'View all in grid mode' :
                        'Infinite scroll mode' }
                </Button> }

                { this.state.isFetchingNotes && this.state.infiniteViewMode
                && <LoadingSpinner color='primary-dark' size='small'/> }

                { this.state.isLoading && <LoadingSpinner color='primary-dark' size='medium' /> }
            </div>
        );
    };

    render() {
        return (
            <div className='Home'>
                { this.props.isAuthenticated ? this.renderNotes() : Home.renderLander() }
            </div>
        );
    }
}
