import "../styles/CharacterComponent.css";

import React, { Component } from "react";
import Character from "../models/character/Character";
import CharacterPortrait from "../models/character/CharacterPortrait";
import { getAge } from "../assorted/Utils";
import HTMLReactParser from "html-react-parser";
import ReactModal from "react-modal";

interface CharacterComponentProps {
   character: Character;
   embedded?: boolean;
   portrait?: boolean;
}

interface CharacterComponentState {
   modalOneIsOpen: boolean;
}

ReactModal.setAppElement("#root");

/**
 * Component for displaying character information including a portrait and detailed information.
 *
 * @component
 * @extends {Component<CharacterComponentProps, CharacterComponentState>}
 */
class CharacterComponent extends Component<
   CharacterComponentProps,
   CharacterComponentState
> {
   private characterPortrait: CharacterPortrait;

   /**
    * Creates an instance of CharacterComponent.
    *
    * @param {CharacterComponentProps} props - The props for the component.
    */
   constructor(props: CharacterComponentProps) {
      super(props);
      this.characterPortrait = new CharacterPortrait({
         character: this.props.character,
      });
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
    * Refreshes character data and forces a component update.
    */
   async componentDidMount(): Promise<void> {
      await this.props.character.refresh();
      await this.characterPortrait.refresh();
      await this.props.character.alliance?.refresh();
      await this.props.character.corporation?.refresh();
      await this.props.character.bloodline?.refresh();
      await this.props.character.faction?.refresh();
      await this.props.character.race?.refresh();

      this.forceUpdate();
   }

   /**
    * Renders the CharacterComponent.
    *
    * @returns {React.ReactNode} The rendered component.
    */
   render(): React.ReactNode {
      const { character, embedded } = this.props;
      return (
         <div>
            {character?.name && (
               <div className={embedded ? "embed" : "noEmbed"}>
                  <div
                     className={
                        embedded
                           ? "characterContainerEmbedded"
                           : "characterContainer"
                     }
                  >
                     {this.characterPortrait?.extraLarge && (
                        <div className="imagePortraitContainer">
                           <img
                              src={this.characterPortrait.extraLarge}
                              alt="Character Portrait"
                              className="imagePortrait"
                           />
                        </div>
                     )}

                     {character.description && (
                        <div className="description">
                           <div>
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
                                 <div className="container">
                                    {HTMLReactParser(character.description)}
                                 </div>
                                 <button onClick={this.closeModalOne}>
                                    RETURN
                                 </button>
                              </ReactModal>
                           </div>
                        </div>
                     )}

                     <div className="bio">
                        <div className="splitText">
                           <div className="altText">
                              {embedded ? "CEO" : "Name"}
                           </div>
                           <div>{character.name}</div>
                        </div>
                        {character.title && (
                           <div className="splitText">
                              <div className="altText">Title</div>
                              <div>{character.title}</div>
                           </div>
                        )}
                        {character.gender && (
                           <div className="splitText">
                              <div className="altText">Gender</div>
                              <div>{character.gender.toUpperCase()}</div>
                           </div>
                        )}
                        {character.race?.name && (
                           <div className="splitText">
                              <div className="altText">Race</div>
                              <div>{character.race.name}</div>
                           </div>
                        )}
                        {character.bloodline?.name && (
                           <div className="splitText">
                              <div className="altText">Bloodline</div>
                              <div>{character.bloodline.name}</div>
                           </div>
                        )}
                        {character.faction?.name && (
                           <div className="splitText">
                              <div className="altText">Faction</div>
                              <div>{character.faction.name}</div>
                           </div>
                        )}
                        {character.birthday && (
                           <div className="splitText">
                              <div className="altText">DOB</div>
                              <div>
                                 {character.birthday.toLocaleDateString()}
                                 {" ("}
                                 {getAge(character.birthday)} years{")"}
                              </div>
                           </div>
                        )}
                        {character.securityStatus && (
                           <div className="splitText">
                              <div className="altText">Security Status</div>
                              <div>{character.securityStatus.toFixed(3)}</div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>
      );
   }
}

export default CharacterComponent;
