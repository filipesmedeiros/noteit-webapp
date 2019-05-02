import React, { useEffect } from 'react'
import {ListGroup} from "react-bootstrap";
import * as ReactDOM from "react-dom";

export default (props) => {
    const classes = props.classNames.concat('scrollable-ver');

    useEffect(() => {
        const list = ReactDOM.findDOMNode(props.reference.current);
        if(list.clientHeight < list.scrollHeight)
            list.classList.add('overflowing-ver');
    });

    let isEndOfScroll = () => {
        const listDOM = ReactDOM.findDOMNode(props.reference.current);
        return listDOM.scrollHeight - listDOM.scrollTop === listDOM.clientHeight;
    };

    return (
        <ListGroup
            className={classes} onScroll={() => {
                if(isEndOfScroll()) props.endOfScroll();
            }}
            ref={props.reference}>
            {!props.isLoading && props.itemList}
        </ListGroup>
    );
}