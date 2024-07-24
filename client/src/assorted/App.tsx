import React, { FC } from "react";
import "../styles/App.css";
import { createUUID } from "./Utils";
import LayoutComponent from "../components/LayoutComponent";

/**
 * Props for the App component.
 * @property {string} [uuid] - Optional UUID for the layout component. If not provided, a new UUID will be generated.
 */
interface AppProps {
   uuid?: string;
}

/**
 * App component that wraps the LayoutComponent with a background div.
 * If a UUID is not provided, a new one will be generated.
 *
 * @param {AppProps} props - The props for the App component.
 * @returns {JSX.Element} The rendered App component.
 */
const App: FC<AppProps> = ({ uuid = createUUID() }: AppProps): JSX.Element => {
   return (
      <div className="background">
         <LayoutComponent uuid={uuid} />
      </div>
   );
};

export default App;
