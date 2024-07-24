import React from "react";
import App from "./App";
import { getCookie } from "./Utils";

import "normalize.css";
import "../styles/index.css";

/**
 * AppLoader component that initializes the App component with a UUID from cookies.
 * If the UUID cookie is not present, a new UUID will be generated within the App component.
 *
 * @returns {JSX.Element} The rendered AppLoader component.
 */
const AppLoader: React.FC = () => {
   const uuid = getCookie("uuid");

   return <App uuid={uuid!} />;
};

export default AppLoader;
