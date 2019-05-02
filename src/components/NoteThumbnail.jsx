import React from 'react';
import './NoteThumbnail.sass'

let scrollThumbnail = (props) =>
    <div>
        <div className='float-left center-content-vertically'>
            <h4>{props.title}</h4>
            <p>Created on {props.date}</p>
        </div>
        <div className='float-right center-content-vertically'>
            {props.attachment && <p>Attachment</p>}
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
}

export default (props) => props.scrollThumbnail ? scrollThumbnail(props) : pagedThumbnail(props);