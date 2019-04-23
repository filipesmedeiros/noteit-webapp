import React from 'react';
import { HelpBlock } from 'react-bootstrap';

export default (props) => {
    return (
        props.condition && <HelpBlock className={props.className}>{props.content}</HelpBlock>
    );
}