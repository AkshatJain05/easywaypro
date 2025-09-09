import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
<<<<<<< HEAD
        <Toaster position="top-center" />
=======
        <Toaster position="top-center"/>
>>>>>>> 8bfe856aabc6e41d5f40e840e6535bfaf94aeb46
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
