import "../styles/LayoutComponent.css";

import login from "../../public/eve-sso-login-black-large.png";

import React, { Component } from "react";
import axios from "axios";
import { getCookie, setCookie, RouteManager as RM } from "../assorted/Utils";
import CharacterComponent from "./CharacterComponent";
import Character from "../models/character/Character";
import CorporationComponent from "./CorporationComponent";
import Corporation from "../models/corporation/Corporation";

interface LayoutComponentProps {
   uuid: string;
}

interface LayoutComponentState {
   authenticated: boolean;
   userId: number;
}

/**
 * LayoutComponent handles user authentication and displays the user's character and corporation information.
 *
 * @component
 * @extends {Component<LayoutComponentProps, LayoutComponentState>}
 */
class LayoutComponent extends Component<
   LayoutComponentProps,
   LayoutComponentState
> {
   constructor(props: LayoutComponentProps) {
      super(props);
      this.state = {
         authenticated: false,
         userId: 0,
      };
   }

   /**
    * Handles the login button click event.
    * Redirects the user to the EVE Online SSO login page.
    */
   handleLoginClick = async (): Promise<void> => {
      const base = "https://login.eveonline.com/v2/oauth/authorize/";
      const response_type = "code";
      const redirect_uri = RM.getAuthRedirect();
      const client_id = "54d99b40528c480fbd73506d9662b1a0";
      const scope = RM.getScopes();
      const url =
         base +
         "?" +
         "response_type=" +
         response_type +
         "&" +
         "redirect_uri=" +
         redirect_uri +
         "&" +
         "client_id=" +
         client_id +
         "&" +
         "scope=" +
         scope +
         "&" +
         "state=" +
         this.props.uuid;

      setCookie("uuid", this.props.uuid);

      window.location.replace(url);
   };

   /**
    * Creates a new Character instance.
    *
    * @returns {Character} The created Character instance.
    */
   getCharacter(): Character {
      return new Character({ id: this.state.userId });
   }

   /**
    * Creates and refreshes the character's corporation.
    *
    * @returns {Promise<Corporation>} The refreshed corporation data.
    */
   async getCorporation(): Promise<Corporation> {
      const character = this.getCharacter();
      await character.refresh();
      return character.corporation!;
   }

   /**
    * Renders the authenticated view of the component.
    *
    * @returns {JSX.Element} The authenticated view.
    */
   showAuthenticated(): JSX.Element {
      return (
         <div className="layout">
            <CharacterComponent character={this.getCharacter()} />
            <CorporationComponent character={this.getCharacter()} />
         </div>
      );
   }

   /**
    * Renders the login view of the component.
    *
    * @returns {JSX.Element} The login view.
    */
   showLogin(): JSX.Element {
      return (
         <div className="container">
            <header className="login">
               <img src={login} alt="login" onClick={this.handleLoginClick} />
            </header>
         </div>
      );
   }

   /**
    * Checks if the user is authenticated by making an API call.
    *
    * @returns {Promise<boolean>} True if authenticated, false otherwise.
    */
   async isAuthenticated(): Promise<boolean> {
      try {
         const result = await axios.get(RM.getRouteUrl("authenticate"), {
            params: {
               state: this.props.uuid,
            },
         });
         if (result && result.status === 200) {
            this.setState({ userId: result.data.CharacterID });
            return true;
         }
         return false;
      } catch (error) {
         return false;
      }
   }

   /**
    * Authenticates the user using the UUID stored in cookies.
    *
    * @returns {Promise<boolean>} True if authenticated, false otherwise.
    */
   async authenticateWithCookie(): Promise<boolean> {
      const uuid = getCookie("uuid");

      if (!uuid) {
         return false;
      }

      try {
         const result = await axios.get(RM.getRouteUrl("authenticate"), {
            params: {
               state: uuid,
            },
         });

         if (result && result.status === 200) {
            this.setState({ userId: result.data.CharacterID });
            return true;
         } else {
            return false;
         }
      } catch {
         return false;
      }
   }

   /**
    * Lifecycle method called after the component is mounted.
    * Checks authentication status and updates the state accordingly.
    */
   async componentDidMount(): Promise<void> {
      if (await this.isAuthenticated()) {
         this.setState({ authenticated: true });
      } else {
         if (await this.authenticateWithCookie()) {
            this.setState({ authenticated: true });
         } else {
            this.setState({ authenticated: false });
         }
      }
   }

   /**
    * Renders the LayoutComponent.
    *
    * @returns {JSX.Element} The rendered component.
    */
   render(): JSX.Element {
      if (this.state.authenticated) {
         return this.showAuthenticated();
      } else {
         return this.showLogin();
      }
   }
}

export default LayoutComponent;
