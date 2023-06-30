import React from "react";
import ReactDOM from "react-dom/client";
import Cookies from "js-cookie";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.scss";
import store from "./redux/store";
import Home from "./components/Home";
import Auth from "./components/Auth";
import reportWebVitals from "./reportWebVitals";
import Main from "./components/Main";
import Error from "./components/Error";
import { Provider } from "react-redux";


const root = ReactDOM.createRoot(document.getElementById("root"));
const logged = () => Cookies.get("REFRESHJWTTOKEN");
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>
  },
  {
    path: "/client/home",
    element: <Home/>
  },
  {
    path: "/client/auth",
    element: (() => {
      return !logged() ? (
        <Auth />
      ) : (
        <Navigate replace to={ "/client/home" }/>
      )
    })()
  },
  {
    path: "/client/*",
    element: <Error />
  }
]);



root.render(
  <React.StrictMode>
    <Provider store={ store }>
      <RouterProvider router={ router } />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
