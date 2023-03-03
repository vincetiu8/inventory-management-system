/**
 * @interface IAuth
 * @description Interface for the Auth state
 * @property {string | null} token - The user's JWT token
 * @property {boolean} isAdmin - Whether the user is an admin
 */
export interface IAuth {
  token: string;
  isAdmin: boolean;
}
