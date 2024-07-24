import "../styles/CorporationComponent.css";

import React, { Component } from "react";
import CorporationIcon from "../models/corporation/CorporationIcon";
import { getAge } from "../assorted/Utils";
import HTMLReactParser from "html-react-parser";
import ReactModal from "react-modal";
import Character from "../models/character/Character";
import CharacterComponent from "./CharacterComponent";

interface CorporationComponentProps {
   character: Character;
}

interface CorporationComponentState {
   modalOneIsOpen: boolean;
}

ReactModal.setAppElement("#root");

/**
 * Component for displaying corporation information including icon and detailed information.
 *
 * @component
 * @extends {Component<CorporationComponentProps, CorporationComponentState>}
 */
class CorporationComponent extends Component<
   CorporationComponentProps,
   CorporationComponentState
> {
   private corporationIcon: CorporationIcon | undefined;

   /**
    * Creates an instance of CorporationComponent.
    *
    * @param {CorporationComponentProps} props - The props for the component.
    */
   constructor(props: CorporationComponentProps) {
      super(props);
      this.state = {
         modalOneIsOpen: false,
      };
   }

   /**
    * Opens the modal.
    */
   openModalOne = (): void => {
      this.setState({ modalOneIsOpen: true });
   };

   /**
    * Closes the modal.
    */
   closeModalOne = (): void => {
      this.setState({ modalOneIsOpen: false });
   };

   /**
    * Lifecycle method that is called after the component is mounted.
    * Refreshes character and corporation data and initializes the corporation icon.
    */
   async componentDidMount(): Promise<void> {
      const { character } = this.props;
      await character.refresh();
      await character.corporation?.refresh();
      this.corporationIcon = new CorporationIcon({
         corporation: character.corporation!,
      });
      await this.corporationIcon.refresh();
      await character.corporation?.alliance?.refresh();
      await character.corporation?.ceo?.refresh();
      await character.corporation?.creator?.refresh();
      await character.corporation?.faction?.refresh();
      await character.corporation?.homeStation?.refresh();

      this.forceUpdate();
   }

   /**
    * Renders the CorporationComponent.
    *
    * @returns {React.ReactNode} The rendered component.
    */
   render(): React.ReactNode {
      const { character } = this.props;
      return (
         <div>
            {character?.corporation?.ceo?.name && (
               <div className="corporationOneContainer">
                  {character?.corporation?.name &&
                     this.corporationIcon?.large && (
                        <div className="corporationTwoContainer">
                           <div className="corporationThreeContainer">
                              {this.corporationIcon?.large && (
                                 <div className="imagePortraitContainer">
                                    <img
                                       src={this.corporationIcon.large}
                                       alt="Corporation Icon"
                                       className="imagePortrait"
                                    />
                                 </div>
                              )}
                              {character?.corporation?.description && (
                                 <div className="descriptions">
                                    {character?.corporation?.url && (
                                       <a
                                          className="fixedWidth"
                                          href={character.corporation.url}
                                          target="_blank"
                                          rel="noreferrer"
                                       >
                                          URL
                                       </a>
                                    )}
                                    <button
                                       className="fixedWidth"
                                       onClick={this.openModalOne}
                                    >
                                       OPEN
                                    </button>
                                    <ReactModal
                                       isOpen={this.state.modalOneIsOpen}
                                       onRequestClose={this.closeModalOne}
                                       contentLabel="Description Modal"
                                       style={{
                                          overlay: {
                                             backgroundColor: "#000000",
                                             border: "3px solid #4fb4d8",
                                             borderRadius: "5px",
                                             width: "100%",
                                             height: "100%",
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                          },
                                          content: {
                                             backgroundColor: "#000000",
                                             border: "3px solid #ef7c2a",
                                             borderRadius: "5px",
                                             display: "flex",
                                             flexDirection: "column",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             textAlign: "center",
                                             overflow: "auto",
                                             lineHeight: "1",
                                             fontFamily: "Oswald, sans-serif",
                                             color: "#4fb4d8",
                                             fontWeight: "normal",
                                             fontSize: "normal",
                                             height: "99%",
                                             width: "99%",
                                          },
                                       }}
                                    >
                                       <div>
                                          {HTMLReactParser(
                                             character.corporation.description,
                                          )}
                                       </div>
                                       <button onClick={this.closeModalOne}>
                                          RETURN
                                       </button>
                                    </ReactModal>
                                 </div>
                              )}
                              <div className="bio">
                                 <div className="splitText">
                                    <div className="altText2">Corporation</div>
                                    <div>{character.corporation.name}</div>
                                 </div>
                                 {character.corporation.memberCount && (
                                    <div className="splitText">
                                       <div className="altText2">Members</div>
                                       <div>
                                          {character.corporation.memberCount}
                                       </div>
                                    </div>
                                 )}
                                 {character.corporation.creator?.name && (
                                    <div className="splitText">
                                       <div className="altText2">Creator</div>
                                       <div>
                                          {character.corporation.creator.name}
                                       </div>
                                    </div>
                                 )}
                                 {character.corporation.dateFounded && (
                                    <div className="splitText">
                                       <div className="altText2">Founded</div>
                                       <div>
                                          {character.corporation.dateFounded.toLocaleDateString()}
                                          {" ("}
                                          {getAge(
                                             character.corporation.dateFounded,
                                          )}{" "}
                                          years{")"}
                                       </div>
                                    </div>
                                 )}
                                 {character.corporation.faction?.name && (
                                    <div className="splitText">
                                       <div className="altText2">Faction</div>
                                       <div>
                                          {character.corporation.faction.name}
                                       </div>
                                    </div>
                                 )}
                                 {character.corporation.ticker && (
                                    <div className="splitText">
                                       <div className="altText2">Ticker</div>
                                       <div>{character.corporation.ticker}</div>
                                    </div>
                                 )}
                                 {character.corporation.shares && (
                                    <div className="splitText">
                                       <div className="altText2">Shares</div>
                                       <div>{character.corporation.shares}</div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     )}
                  {character.corporation.ceo && (
                     <CharacterComponent
                        character={character.corporation.ceo}
                        embedded={true}
                        portrait={true}
                     />
                  )}
               </div>
            )}
         </div>
      );
   }
}

export default CorporationComponent;
