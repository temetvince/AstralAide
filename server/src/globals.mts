/**
 * Represents the global data for the application.
 */
class GlobalsData {
   rootURI: string;
   client_id: string;
   client_secret: string;
   logins: Map<string, string>;
   tokens: Map<string, string>;

   /**
    * Initializes a new instance of the GlobalsData class.
    */
   constructor() {
      // Set this to the root URI of your app, for example https://astralaide.com/
      this.rootURI = '';

      // Get client id & secret from https://developers.eveonline.com/
      this.client_id = '';
      this.client_secret = '';

      this.logins = new Map();
      this.tokens = new Map();
   }
}

/**
 * Provides access to the global data for the application.
 */
class Globals {
   private static instance: GlobalsData = new GlobalsData();

   private constructor() {}

   /**
    * Gets the root URI of the application.
    * @returns The root URI.
    */
   public static getRootURI(): string {
      return Globals.instance.rootURI;
   }

   /**
    * Gets the client ID for the application.
    * @returns The client ID.
    */
   public static getClientId(): string {
      return Globals.instance.client_id;
   }

   /**
    * Gets the client secret for the application.
    * @returns The client secret.
    */
   public static getClientSecret(): string {
      return Globals.instance.client_secret;
   }

   /**
    * Gets the logins map for the application.
    * @returns The logins map.
    */
   public static getLogins(): Map<string, string> {
      return Globals.instance.logins;
   }

   /**
    * Gets the tokens map for the application.
    * @returns The tokens map.
    */
   public static getTokens(): Map<string, string> {
      return Globals.instance.tokens;
   }
}

export default Globals;
