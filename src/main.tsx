import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";
import { store } from "./app/store";

import { SocketProvider } from "./features/chat/context/SocketContext";
import { LocationProvider } from "./context/LocationContext";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "189180222609-l49871p9p27cub7etoh8t4hm2haf0aec.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <BrowserRouter>
          <SocketProvider>
            <LocationProvider>
              <Toaster position="top-right" />
              <App />
            </LocationProvider>
          </SocketProvider>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);