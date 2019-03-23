import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import LogIn from './containers/LogIn';

export default () =>
    <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={LogIn} />

        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound}/>
    </Switch>;
