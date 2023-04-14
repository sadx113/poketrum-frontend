import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
  background: "white",
  marginBottom: 24,
});

const nutritionFacts = [
  {
    label: "Daily Return",
    value: 8,
  },
  {
    label: "APR",
    value: "2,920",
  },
  {
    label: "Dev Fee",
    value: 1,
  },
];

export default function NutritionFacts() {
  return (
    <CardWrapper>
      <CardContent>
        <Typography variant="h5" borderBottom="6px solid" paddingBottom={1}>
          Buy Taco Truck
        </Typography>
      </CardContent>
    </CardWrapper>
  );
}
