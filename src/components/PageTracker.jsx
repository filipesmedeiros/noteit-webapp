import React from 'react'
import {Button} from 'react-bootstrap'
import config from '../config'
import './PageTracker.sass'

// Default page size (for shortness in the middle of JSX)
const DPS = config.DEFAULT_NOTES_PAGE_SIZE;

export default (props) =>
    <div className='page-tracker'>
        <div className='page-changer flex-center'>
            <Button
                className='square medium'
                onClick={props.previousPage}
                style={{ visibility: props.currentPage === 1 ? 'hidden' : 'visible' }}>{'<'}</Button>

            <Button className='square medium'>{props.currentPage}</Button>

            <Button
                className='square medium'
                onClick={props.nextPage}
                style={{ visibility: props.currentPage >= props.numberOfPages ? 'hidden' : 'visible' }}>{'>'}</Button>
        </div>
        <span className='page-sizer-tooltip flex-center'>Number of items per page</span>
        <div className='page-sizer flex-center'>
            {/* ALWAYS make sure the text and the value passed to the function are the same */}
            <Button className='page-size-button square small' onClick={() => props.changePageSize(DPS)}>{DPS}</Button>
            <Button className='page-size-button square small' onClick={() => props.changePageSize(DPS * 2)}>{DPS * 2}</Button>
            <Button className='page-size-button square small' onClick={() => props.changePageSize(DPS * 4)}>{DPS * 4}</Button>
        </div>
    </div>