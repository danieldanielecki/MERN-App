
import axios from "axios";

// Takes a token, if the token is there then add this to global HTTP headers, if not then it's gonna to delete it from global HTTP headers. When we have a token we're just gonna to send this with every request, instead of picking and choosing which request to send with.
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;
