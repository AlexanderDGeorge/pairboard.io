import React from "react";
import { Route, Switch } from "react-router";
import NewMessage from "./NewMessage";

export default function MessagesRouter() {
    return (
        <Switch>
            <Route path="/messages" component={NewMessage} />
        </Switch>
    );
}
