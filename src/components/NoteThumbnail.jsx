import React from 'react';
import './NoteThumbnail.sass'

export default (props) =>
    <>
        <div className='float-left center-content-vertically'>
            <h4>{props.title}</h4>
            <p>Created on {props.date}</p>
        </div>
        <div className='float-right center-content-vertically'>
            {props.attachment && <p>Attachment</p>}
        </div>
    </>