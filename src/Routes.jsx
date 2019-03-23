import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute'
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import LogIn from './containers/LogIn';
import SignUp from './containers/SignUp';
import NewNote from './containers/NewNote';

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={LogIn} props={childProps} />
        <AppliedRoute path="/signup" exact component={SignUp} props={childProps} />
        <AppliedRoute path="/notes/new" exact component={NewNote} props={childProps} />

        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound}/>
    </Switch>;
