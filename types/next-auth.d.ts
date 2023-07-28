import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: {
      /** The user's postal address. */
      name: string,
      sub:string,
      id: number,
      lname: string,
      username: string,
      password: string,
      role: string,
      active: boolean,
      Permission: {
        add: boolean;
        edit: boolean;
        print: boolean;
        systemID: number;
        view: boolean;
      }[],
    }
  }
}