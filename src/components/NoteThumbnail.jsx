import React from 'react';
import PaperclipIcon from '../components/PaperclipIcon';
import ShareIcon from '../components/ShareIcon';
import './NoteThumbnail.sass'


let scrollThumbnail = (props) =>
    <div>
        <div className='float-left center-content-vertically'>
            <h4 className='w-fit'>{props.title}</h4>
            <p>Created on {props.date}</p>
        </div>
        <div className='float-right center-content-vertically note-icons'>
            {props.attachment && <PaperclipIcon classes='float-left' color='primary' size='25px'/>}
            <ShareIcon classes='float-right'color='primary' size='25px'/>
        </div>
    </div>;

let pagedThumbnail = (props) => {
    return (
        <>
            <div className='name-and-date dist-content-vertically'>
                <h4 className='m-auto-hor'>
                    {props.title}
                </h4>
                <p className='m-auto-hor'>
                    {props.date}
                </p>
            </div>
            { props.attachment &&
            <div className='end-content-vertically'>
                <p>Attachment</p>
            </div> }
        </>
    );
};

export default (props) => props.scrollThumbnail ? scrollThumbnail(props) : pagedThumbnail(props);