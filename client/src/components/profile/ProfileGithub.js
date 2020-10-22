import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

// Pull out "username", so every time we access the property we don't have to do "props.username", instead simply use this variable directly "username". Same logic applies for "getGithubRepos" and "repos".
const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  // React's Hook "useEffect()", because we're dealing with Functional Components, instead of Class Components and its lifecycle methods such as "componentDidMount()".
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos]); // The brackets "[]" here makes "useEffect()" to run only it loads, without brackets "useEffect()" will keep running and it'll be a constant loop. The brackets basically are equivalent to "componentDidMount()" in Class Components. ESLint would say that "getGithubRepos" should be added as dependency between the "[]". Therefore, fix this. warnings too.

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {/* Since we're getting data and displaying it we want to make sure that the profile/data is loaded. Therefore, as long as it loads - show spinner. That way the UI is not actually rendered unless the data is loaded. */}
      {repos === null ? (
        <Spinner />
      ) : (
        // Loop/map through repos and output each item.
        repos.map((repo) => (
          <div key={repo._id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Make sure "getGithubRepos", "repos" and "username" props are required.
ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos, // Whatever State we want or whatever Prop we wanna call it, here it's "repos". "repos" comes from the root reducer, accesing this via "state.profile.repos" to get the state inside "repos". So "props.profile.repos" is becoming available for us, or simply "repos" nested into an object how it's done here.
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub); // Connect Redux's Actions to the component. Whenever we want to use an Action, we need to pass it to the "connect(...)". First parameter is any state we want to map. The second is an object with any Actions we wanna use. "getGithubRepos" allows us to access "props.getGithubRepos" or simply "getGithubRepos" nested into an object how it's done here. Basically, whenever we want to interact component with Redux (calling an Action or getting a State) we wanna use "connect".
