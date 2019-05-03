import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute'
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import LogIn from './containers/LogIn';
import SignUp from './containers/SignUp';
import NewNote from './containers/NewNote';
import Note from './containers/Note';
import Settings from './containers/Settings';
import Friends from './containers/Friends';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';


export default ({childProps}) =>

    // This Switch chooses which page (component) to display based on the URL
    // We tell the Router where to go by using links
    <Switch>
        <AppliedRoute path='/' exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={LogIn} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={SignUp} props={childProps} />

        <AuthenticatedRoute path="/notes/new" exact component={NewNote} props={childProps} />
        <AuthenticatedRoute path="/notes/:id" exact component={Note} props={childProps} />

        <AuthenticatedRoute path="/settings" exact component={Settings} props={childProps} />
        <AuthenticatedRoute path="/friends" exact component={Friends} props={childProps} />

        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound}/>
    </Switch>;
