import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/store";
import { restoreUserSession } from "./services/authService";

const Root = () => {
  const dispatch = useDispatch();

  // when the app first loads, check if the user is already logged in
  useEffect(() => {
    restoreUserSession(dispatch);
  }, [dispatch]);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* handle page navigation */}
    <BrowserRouter>
      {/* connect the redux store to the entire app */}
      <Provider store={store}>
        <Root />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);