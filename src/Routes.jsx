import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import LogIn from './containers/LogIn';
import AppliedRoute from './components/AppliedRoute'

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={LogIn} props={childProps} />

        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound}/>
    </Switch>;
