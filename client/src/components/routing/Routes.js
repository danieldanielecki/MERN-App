import { Route, Switch } from "react-router-dom";
import AddEducation from "./../profile-forms/AddEducation";
import AddExperience from "./../profile-forms/AddExperience";
import Alert from "./../layout/Alert";
import CreateProfile from "./../profile-forms/CreateProfile";
import Dashboard from "./../dashboard/Dashboard";
import EditProfile from "./../profile-forms/EditProfile";
import Login from "./../auth/Login";
import NotFound from "./../layout/NotFound";
import PrivateRoute from "./../routing/PrivateRoute";
import Post from "./../post/Post";
import Posts from "./../posts/Posts";
import Profile from "./../profile/Profile";
import Profiles from "./../profiles/Profiles";
import React from "react";
import Register from "./../auth/Register";

export const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route component={Register} exact path="/register" />
        <Route component={Login} exact path="/login" />
        <Route component={Profiles} exact path="/profiles" />
        <Route component={Profile} exact path="/profile/:id" />
        {/* Make the routes are protected. */}
        <PrivateRoute component={Dashboard} exact path="/dashboard" />
        <PrivateRoute component={CreateProfile} exact path="/create-profile" />
        <PrivateRoute component={EditProfile} exact path="/edit-profile" />
        <PrivateRoute component={AddExperience} exact path="/add-experience" />
        <PrivateRoute component={AddEducation} exact path="/add-education" />
        <PrivateRoute component={Posts} exact path="/posts" />
        <PrivateRoute component={Post} exact path="/posts/:id" />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
