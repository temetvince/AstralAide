import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppLoader from "./assorted/AppLoader";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (rootElement) {
   createRoot(rootElement).render(
      <BrowserRouter>
         <AppLoader />
      </BrowserRouter>,
   );
}
