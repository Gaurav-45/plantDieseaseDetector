import React from "react";
import { Route, Switch } from "react-router-dom";
import About from "./pages/About";
import Detect from "./pages/Detect";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Database from "./pages/Database";

const routing = ({ childProps }) => (
  <Switch>
    <Route path="/" exact component={Detect} props={childProps} />
    <Route path="/about" exact component={About} props={childProps} />
    <Route path="/contact" exact component={Contact} props={childProps} />
    <Route path="/database" exact component={Database} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);
export default routing;
