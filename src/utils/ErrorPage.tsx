import React from 'react';
import { Link } from 'react-router-dom';
import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{(error as any).statusText || (error as any).message}</i>
            </p>
            <Link to="/">Go back to home</Link>
        </div>
    );
};

export default ErrorPage;
