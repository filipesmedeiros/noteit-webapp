import React, { Component } from 'react';
import { API, Storage } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { s3Remove, s3Upload } from '../libs/awsLib';
import config from '../config';
import './Note.css';

export default class Notes extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.oldAttachmentKey = null;
        this.oldContent = null;

        this.state = {
            note: null,
            content: '',
            attachmentURL: null,
            isDiff: 0
        };
    }

    /**
     * Needed because WebStorm warns about properties that it doesn't recognize
     * @var note
     * @property note.userId
     */
    async componentDidMount() {
        try {
            let attachmentURL;
            const note = await this.getNote();
            const { content, attachment } = note;

            this.oldContent = content;

            if(attachment) {
                attachmentURL = await Storage.vault.get(attachment);
                this.oldAttachmentKey = attachment;
            }

            this.setState({
                note,
                content,
                attachmentURL
            });
        } catch (e) {
            alert(e);
        }
    }

    getNote() {
        return API.get('notes', `/notes/${this.props.match.params.id}`, {});
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    static formatFilename(str) {
        return str.replace(/^\w+-/, '');
    }

    // TODO Find more elegant way to code this, or at least more perceptible
    handleChange = event => {
        let testDiff = event.target.value !== this.oldContent ? 1 : 0;

        this.setState({
            [event.target.id]: event.target.value,
            isDiff: this.state.isDiff !== 2 ? testDiff : 2
        });

        console.log(this.state.isDiff);
    };

    handleFileChange = event => {
        this.file = event.target.files[0];

        this.setState({ isDiff: 2});
    };

    saveNote(note) {
        return API.put('notes', `/notes/${this.props.match.params.id}`, {
            body: note
        });
    }

    handleSubmit = async event => {
        let attachment;

        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {
            if(this.file) {
                attachment = await s3Upload(this.file);

                if(this.oldAttachmentKey)
                    await s3Remove(this.oldAttachmentKey);
            }

            await this.saveNote({
                content: this.state.content,
                attachment: attachment || this.state.note.attachment
            });

            this.props.history.push('/');
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

    deleteNote() {
        return API.del('notes', `/notes/${this.props.match.params.id}`, {});
    };

    // TODO find a way to delete attachment when note is deleted or attachment changed
    // TODO make a cooler confirmation prompt
    handleDelete = async event => {
        event.preventDefault();

        this.setState({ isDeleting: true});

        const confirmed = window.confirm(
            'Are you sure you want to delete this note?'
        );

        if(!confirmed) {
            this.setState({ isDeleting: false});
            return;
        }

        try {
            await this.deleteNote();

            if(this.oldAttachmentKey)
                await s3Remove(this.oldAttachmentKey);

            this.props.history.push('/');
        } catch(e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

    render() {
        return (
            <div className='Note'>
                {this.state.note &&
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId='content'>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.content}
                            componentClass='textarea'
                        />
                    </FormGroup>
                    {this.state.note.attachment &&
                    <FormGroup>
                        <ControlLabel>Attachment</ControlLabel>
                        <FormControl.Static>
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href={this.state.attachmentURL}
                            >
                                {Notes.formatFilename(this.state.note.attachment)}
                            </a>
                        </FormControl.Static>
                    </FormGroup>}
                    <FormGroup controlId='file'>
                        {!this.state.note.attachment &&
                        <ControlLabel>Attachment</ControlLabel>}
                        <FormControl onChange={this.handleFileChange} type='file' />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle='primary'
                        bsSize='large'
                        disabled={!this.validateForm() || !this.state.isDiff}
                        type='submit'
                        isLoading={this.state.isLoading}
                        text='Save'
                        loadingText='Saving…'
                    />
                    <LoaderButton
                        block
                        bsStyle='danger'
                        bsSize='large'
                        isLoading={this.state.isDeleting}
                        onClick={this.handleDelete}
                        text='Delete'
                        loadingText='Deleting…'
                    />
                </form>}
            </div>
        );
    }

}
