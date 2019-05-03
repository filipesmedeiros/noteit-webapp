import React from 'react';
import './LoadingSpinner.sass'

const defaultColor = 'primary-dark';
const defaultSize = 'medium';

export default (props) => <div className={'loading-spinner ' + (props.color || defaultColor) + ' ' + (props.size || defaultSize)} />