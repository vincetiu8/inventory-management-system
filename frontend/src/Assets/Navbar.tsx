import React from "react";
import { Container, Grid, Tab, TabList, Tabs, Typography } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import { IAuth } from "../Auth/IAuth";

interface NavbarProps {
  isAdmin: boolean;
  setAuth: (auth: IAuth) => void;
}

/**
 * The top navigation bar of the page
 * @param isAdmin - whether the user is an admin
 * @param setAuth - the function to set the auth state
 */
function Navbar({ isAdmin, setAuth }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setAuth({ token: "", isAdmin: false });
    navigate("/login");
  };

  return (
    <Container
      maxWidth={false}
      sx={(theme) => ({
        backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel})`,
        margin: 0,
        padding: 1,
      })}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography
            level="h3"
            sx={{
              color: "white",
            }}
          >
            Inventory Management System
          </Typography>
        </Grid>
        <Grid>
          <Tabs
            sx={{
              backgroundColor: "transparent",
            }}
          >
            <TabList
              variant="outlined"
              sx={(theme) => ({
                backgroundColor: `rgba(${theme.vars.palette.neutral.mainChannel}`,
              })}
            >
              <Tab
                onClick={() => navigate("/items")}
                sx={{
                  color:
                    location.pathname.indexOf("items") !== -1
                      ? "black"
                      : "white",
                }}
              >
                Items
              </Tab>
              <Tab
                onClick={() => navigate("/txs")}
                sx={{
                  color:
                    location.pathname.indexOf("txs") !== -1 ? "black" : "white",
                }}
              >
                Transactions
              </Tab>
              {isAdmin && (
                <Tab
                  onClick={() => navigate("/employees")}
                  sx={{
                    color:
                      location.pathname.indexOf("employees") !== -1
                        ? "black"
                        : "white",
                  }}
                >
                  Employees
                </Tab>
              )}
              <Tab onClick={logout} sx={{ color: "white" }}>
                Logout
              </Tab>
            </TabList>
          </Tabs>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Navbar;
