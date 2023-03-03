import React from "react";
import {
  Button,
  Card,
  Container,
  FormLabel,
  Grid,
  Input,
  Typography,
} from "@mui/joy";
import axios from "axios";
import { IAuth } from "./IAuth";

interface LoginPageProps {
  setAuth: (auth: IAuth) => void;
}

/**
 * A page allowing the user to log in to the website.
 * @param setAuth - the function to set the auth state
 */
function LoginPage({ setAuth }: LoginPageProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Logs in the user
  const login = async () => {
    const resp = await axios.post("/api/employees/login", { email, password });
    setAuth(resp.data);
    localStorage.setItem("token", resp.data.token);
    localStorage.setItem("isAdmin", resp.data.isAdmin);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card variant="outlined">
        <Grid container spacing={2} direction="column">
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Typography level="h2">Login</Typography>
          </Grid>
          <Grid>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              onSubmit={login}
            />
          </Grid>
          <Grid>
            <FormLabel
              sx={{
                marginTop: "1rem",
              }}
            >
              Password
            </FormLabel>
            <Input
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onSubmit={login}
            />
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="outlined" onClick={login}>
              Login
            </Button>
          </Grid>
        </Grid>
        <br />
      </Card>
    </Container>
  );
}

export default LoginPage;
