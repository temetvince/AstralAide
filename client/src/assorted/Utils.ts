import publicRoutes from "../../public/routes.json";

/**
 * Sets a cookie with a specified name and value, which expires in 7 days.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} val - The value of the cookie.
 */
export function setCookie(name: string, val: string): void {
   const date = new Date();
   date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
   document.cookie = `${name}=${val}; expires=${date.toUTCString()}; path=/`;
}

/**
 * Retrieves the value of a cookie with a specified name.
 *
 * @param {string} name - The name of the cookie.
 * @returns {string | null} The value of the cookie, or null if not found.
 */
export function getCookie(name: string): string | null {
   const value = `; ${document.cookie}`;
   const parts = value.split(`; ${name}=`);
   if (parts.length === 2) {
      return parts.pop()?.split(";")?.shift() ?? null;
   }
   return null;
}

/**
 * Deletes a cookie with a specified name.
 *
 * @param {string} name - The name of the cookie.
 */
export function deleteCookie(name: string): void {
   const date = new Date();
   date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
   document.cookie = `${name}=; expires=${date.toUTCString()}; path=/`;
}

/**
 * Generates a UUID (Universally Unique Identifier) using a combination of timestamp and random numbers.
 *
 * @returns {string} A string representing the generated UUID.
 */
export function createUUID(): string {
   let d = new Date().getTime();
   let d2 =
      (typeof performance !== "undefined" &&
         performance.now &&
         performance.now() * 1000) ||
      0;
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = Math.random() * 16;
      if (d > 0) {
         r = (d + r) % 16 | 0;
         d = Math.floor(d / 16);
      } else {
         r = (d2 + r) % 16 | 0;
         d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
   });
}

/**
 * Calculates the age based on the provided birth date.
 *
 * @param {Date} birthday - The birth date.
 * @returns {number} The calculated age.
 */
export function getAge(birthday: Date): number {
   const ageDifMs = Date.now() - birthday.getTime();
   const ageDate = new Date(ageDifMs);
   return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * The RouteManager class handles the management of routes in the application.
 */
export class RouteManager {
   private static instance: RouteManager;
   private static scopes: string = "";
   private static authRedirect: string = "";
   private static baseurl: string = "";
   private static routes: { path: string; url: string }[] = [];

   private constructor() {}

   /**
    * Returns the singleton instance of the RouteManager.
    *
    * @returns {RouteManager} The singleton instance of the RouteManager.
    */
   public static getInstance(): RouteManager {
      if (!RouteManager.instance) {
         RouteManager.instance = new RouteManager();
      }
      return RouteManager.instance;
   }

   /**
    * Loads routes from the public routes file asynchronously.
    */
   public static async loadRoutesFromFile(): Promise<void> {
      RouteManager.scopes = publicRoutes.scopes;
      RouteManager.authRedirect = publicRoutes.authRedirect;
      RouteManager.baseurl = publicRoutes.baseurl;
      RouteManager.routes = publicRoutes.routes;
   }

   /**
    * Gets the scopes for the routes.
    *
    * @returns {string} The scopes for the routes.
    */
   public static getScopes(): string {
      return RouteManager.scopes;
   }

   /**
    * Gets the authentication redirect URL.
    *
    * @returns {string} The authentication redirect URL.
    */
   public static getAuthRedirect(): string {
      return RouteManager.authRedirect;
   }

   /**
    * Gets all routes.
    *
    * @returns {{ path: string; url: string }[]} An array of route objects.
    */
   public static getRoutes(): { path: string; url: string }[] {
      return RouteManager.routes;
   }

   /**
    * Gets the URL for a specific route path.
    *
    * @param {string} path - The path of the route.
    * @returns {string} The URL corresponding to the specified path.
    * @throws {Error} If the route is not found.
    */
   public static getRouteUrl(path: string): string {
      const route = RouteManager.routes.find((r) => r.path === path);
      if (route) {
         return RouteManager.baseurl + route.url;
      } else {
         throw new Error("Route not found");
      }
   }
}
