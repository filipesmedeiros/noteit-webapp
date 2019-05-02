import React from "react";
import { Button } from "react-bootstrap";
import LoadingSpinner from '../components/LoadingSpinner';

export default ({
                    isLoading,
                    text,
                    loadingText,
                    className = "",
                    disabled = false,
                    ...props
                }) =>
    <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <LoadingSpinner color='primary-dark' size='small'/>}
        {!isLoading ? text : loadingText}
    </Button>;
