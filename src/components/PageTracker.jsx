import React from 'react'
import {Button} from 'react-bootstrap'
import './PageTracker.sass'

export default (props) =>
    <div className='page-tracker'>
        <Button
            onClick={props.previousPage}
            style={{ visibility: props.currentPage === 1 ? 'hidden' : 'visible' }}>{'<'}</Button>

        <Button>{props.currentPage}</Button>

        <Button
            onClick={props.nextPage}
            style={{ visibility: props.currentPage >= props.numberOfPages ? 'hidden' : 'visible' }}>{'>'}</Button>
    </div>