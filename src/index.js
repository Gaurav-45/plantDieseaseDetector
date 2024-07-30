import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

class Index extends Component {
  state = {
    contentCached: false,
    updateAvailable: false,
  };
  componentDidMount() {
    const config = {
      onUpdate: this.handleUpdate,
    };
    serviceWorkerRegistration.register();
  }
  render() {
    return (
      <Router>
        <App updateAvailable={this.state.updateAvailable} />
      </Router>
    );
  }
  handleUpdate = (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
    this.setState({ updateAvailable: true });
  };
}
reportWebVitals();
ReactDOM.render(<Index />, document.getElementById("root"));
