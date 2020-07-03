// import React from "react";
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Welcome from "./components/Welcome";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as firebase from "firebase";
import Main from "./components/dashboard/Main";
import { useHistory } from "react-router-dom";
var app = firebase.initializeApp({
  apiKey: "AIzaSyDk_ibFc64s3vQewijlrngjdPZ8xyILP4M",
  authDomain: "darex-e0bdd.firebaseapp.com",
  databaseURL: "https://darex-e0bdd.firebaseio.com",
  projectId: "darex-e0bdd",
  storageBucket: "darex-e0bdd.appspot.com",
  messagingSenderId: "425634976639",
  appId: "1:425634976639:web:7a3f8e30f8a72ec46e004a",
  measurementId: "G-7ZQ30HRX36",
});
// function App() {
//   return (
//     <Router>
//       <Switch>
//         <Route exact path="/">
//           <Main />
//         </Route>
//         <Route path="/dashboard">
//           <Welcome />
//         </Route>

//       </Switch>
//     </Router>
//   );
// }

// import { Link, Route, Switch } from "react-router-dom";

/* Home component */
const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

/* Category component */
const Category = () => (
  <div>
    <h2>Category</h2>
  </div>
);

/* Products component */
const Products = () => (
  <div>
    <h2>Products</h2>
  </div>
);

export default function App() {
  return (
    <div>
      {/* <nav className="navbar navbar-light">
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Homes</Link>
          </li>
          <li>
            <Link to="/dashboard">Category</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav> */}

      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/dashboard" component={Main} />

        {/* <Route path="/products" component={Products} /> */}
      </Switch>
    </div>
  );
}
// export default App;
