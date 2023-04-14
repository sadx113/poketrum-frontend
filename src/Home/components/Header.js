import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import {Link} from 'react-router-dom'
import logo from "../../assets/FullLogo.png";
import Connect from "./Connect";

const Wrapper = styled("div")(({ theme }) => ({
  textAlign: "center",
  paddingBottom: 24,
  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

export default function Header() {
  return (
    <Wrapper>
      <img src={logo} alt="" width={"100%"} style={{ marginTop: -48 }} />
      <Connect responsive={false} />
      <ButtonContainer container>
        <Grid item flexGrow={1} marginRight={1} marginTop={3} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={(e) => {
              e.preventDefault();
              window.location.href='https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x43FAbC45Cb99BDd33b1e74F534009D45a062EdFF&chainId=42161';
              }}
              >
                  BUY YOSHITRUM
            </Button>
        </Grid>
        <Grid item flexGrow={1} marginRight={1} marginTop={3} alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={(e) => {
              e.preventDefault();
              window.location.href='https://telegra.ph/Yoshitrum-02-20';
              }}
              >
                  LitePaper
            </Button>
        </Grid>
      </ButtonContainer>
    </Wrapper>
  );
}
