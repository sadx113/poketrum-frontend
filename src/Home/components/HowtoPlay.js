import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
  background: "rgb(255 252 248)",
  marginBottom: 24,
});

export default function HowtoPlay() {
  return (
    <CardWrapper>
      <CardContent>
        <Typography variant="h5" borderBottom="6px solid" paddingBottom={1}>
          Yoshitrum
        </Typography>
        <Box paddingTop={2}>
          <Typography>
            Coming Soon!
          </Typography>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
