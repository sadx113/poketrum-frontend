import { styled } from "@mui/system";

import Connect from "./components/Connect";
import Header from "./components/Header";
import BakeCard from "./components/BakeCard";
import Footer from "./components/Footer";
import FAQs from "./components/FAQ";
import ChefCard from "./components/ChefCard";
const Wrapper = styled("div")(({ theme }) => ({
  maxWidth: 400,
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

export default function Home() {

  return (
    <Wrapper>
      <Connect />
      <Header />
      <BakeCard />
      <ChefCard />
      <FAQs />
      <Footer />
    </Wrapper>
  );
}
