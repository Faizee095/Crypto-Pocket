import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";

import App from "./App";
// import 'antd/dist/antd.css';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Router>
    <Provider store={store}>
    <App />
    </Provider>
  </Router>
);

