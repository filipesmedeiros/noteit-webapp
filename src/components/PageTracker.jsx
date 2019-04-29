import React from 'react'
import { Button } from 'react-bootstrap'

export default (props) => {
    return (
        <div>
            <Button
                onClick={props.previousPage}
                disabled={props.currentPage === 1}>{'<'}</Button>

            <Button>{props.currentPage}</Button>

            <Button
                onClick={props.nextPage}
                disabled={props.currentPage === props.numberOfPages}>{'>'}</Button>
        </div>);
}