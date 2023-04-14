import { Card } from "@mui/material";
import { Timeline } from "react-twitter-widgets";

export default function TwitterFeed() {
  return (
    <Card style={{ marginTop: 24 }}>
      <Timeline
        dataSource={{ sourceType: "profile", screenName: "LuckyCat.money" }}
        options={{ width: "400", height: "600" }}
      />
    </Card>
  );
}
