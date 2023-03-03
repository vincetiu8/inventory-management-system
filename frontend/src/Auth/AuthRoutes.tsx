import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import { IAuth } from "./IAuth";

/**
 * A wrapper component whose children routes which can only be navigated to if the user is not authenticated.
 */
function UnauthedRoutesWrapper({ token }: { token: string }) {
  return !token ? <Outlet /> : <Navigate to="/" />;
}

/**
 * A wrapper component whose children routes which can only be navigated to if the user is authenticated.
 */
function ProtectedRoutesWrapper({ token }: { token: string }) {
  return token ? <Outlet /> : <Navigate to="/" />;
}

/**
 * A wrapper component whose children routes which can only be navigated to if the user is an admin.
 */
function AdminRoutesWrapper({ isAdmin }: { isAdmin: boolean }) {
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}

interface IDynamicRedirectProps {
  unAuthPath: string;
  authPath: string;
}

/**
 * A wrapper which navigates to a different route depending on if the user is authenticated or not.
 * @param token - The token of the user.
 * @param unAuthPath - The path to navigate to if the user is not authenticated.
 * @param authPath - The path to navigate to if the user is authenticated.
 */
function DynamicRedirect({
  token,
  unAuthPath,
  authPath,
}: IAuth & IDynamicRedirectProps) {
  return token ? <Navigate to={authPath} /> : <Navigate to={unAuthPath} />;
}

export {
  UnauthedRoutesWrapper,
  ProtectedRoutesWrapper,
  AdminRoutesWrapper,
  DynamicRedirect,
};
