import React from 'react';
import PageTracker from '../components/PageTracker';
import './ItemPage.sass'

export default (props) => {
    const numOfColumns = 3;
    const numOfRows = Math.ceil(props.items.length / numOfColumns);
    let rows = [];

    for(let i = 0; i < numOfRows; i++)
        rows[i] =
            <div className='thumbnail-row' key={i}>
                { props.items.slice(i * numOfColumns, (i * numOfColumns) + numOfColumns).map((item, index) =>
                    <div className='page-item' key={index}>
                        {item}
                    </div>
                )}
            </div>;

    return (
        <div className='item-page'>
            { rows }
        </div>
    );
}

{/*!this.state.isLoading && <PageTracker
                    currentPage={this.state.currentPage}
                    numberOfPages={this.state.notePageMap.length}
                    previousPage={this.previousPage}
                    nextPage={this.nextPage}
                    changePageSize={this.changePageSize}
                />*/}