/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";


const CardWrapper = styled(Card)({
  background: "rgb(251 241 225)",
  marginBottom: 24,
});

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ChefCard() {
  const { busdcontract, contract, wrongNetwork, getBusdBalance, fromWei, toWei, getBusdApproved, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBUSD, setContractBUSD] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    busd: 0,
    beans: 0,
    rewards: 0,
    approved: 0,
  });
  const [bakeBUSD, setBakeBUSD] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const floorYield0 = [0,41, 52, 65, 82, 103];
  const floorYield1 = [0,130, 157, 201, 264, 318];
  const floorYield2 = [0,399, 498, 625, 780, 995];
  const floorYield3 = [0,1220, 1530, 1920, 2380, 3050];
  const floorYield4 = [0,3750,4700,5900,7400,9300];
  const floorYield5 = [0,11400,14300,17900,22700,28700];
  const floorYield6 = [0,36200,45500,57200,72500,91500];
  const floorYield7 = [0,104000,126500,167000,216500,275000];
  const yield0 = [41, 52, 65, 82, 103];
  const yield1 = [130, 157, 201, 264, 318];
  const yield2 = [399, 498, 625, 780, 995];
  const yield3 = [1220, 1530, 1920, 2380, 3050];
  const yield4 = [3750,4700,5900,7400,9300];
  const yield5 = [11400,14300,17900,22700,28700];
  const yield6 = [36200,45500,57200,72500,91500];
  const yield7 = [10400,126500,167000,216500,275000];
  const chefCost0 = [500,625,780,970,1200];
  const chefCost1 = [1500,1800,2300,3000,3600];
  const chefCost2 = [4500,5600,7000,8700,11000];
  const chefCost3 = [13500,16800,21000,26000,33000];
  const chefCost4 = [40500,50600,63000,79000,98000];
  const chefCost5 = [120000,150000,187000,235000,293000];
  const chefCost6 = [365000,456000,570000,713000,890000];
  const chefCost7 = [1000000,1200000,1560000,2000000,2500000];

  const fetchContractBUSDBalance = () => {
    if (!web3 || wrongNetwork) {
      setContractBUSD(0);
      return;
    }
    getBusdBalance(config.contractAddress).then((amount) => {
      setContractBUSD(fromWei(amount));
    });
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        busd: 0,
        beans: 0,
        rewards: 0,
        approved: 0,
      });
      return;
    }

    try {
      const [CurrentTime,busdAmount, rewardsAmount = [], chefAmount = [], approvedAmount] = await Promise.all([
        Math.floor(Date.now() / 1000),
        getBusdBalance(address),
        contract.methods
          .towers(address)
          .call()
          .catch((err) => {
            console.error("Towers", err);
            return 0;
          }),contract.methods
          .getChefs(address)
          .call()
          .catch((err) => {
            console.error("getChefs", err);
            return 0;
          }),
        getBusdApproved(address),
      ]);
      setWalletBalance({
        busd: fromWei(`${busdAmount}`),
        beans: rewardsAmount[0],
        rewards: rewardsAmount[1],
        yield: rewardsAmount[3],
        approved: approvedAmount,
        hotDog: chefAmount[0],
        tacoTruck: chefAmount[1],
        doughnut: chefAmount[2],
        cake: chefAmount[3],
        hamburger: chefAmount[4],
        breakfast: chefAmount[5],
        hibachi: chefAmount[6],
        restaurant: chefAmount[7],
        hours: rewardsAmount[5],
        timestamp: rewardsAmount[4],
        currentTime: CurrentTime
      });
    } catch (err) {
      console.error(err);
      setWalletBalance({
        busd: 0,
        beans: 0,
        rewards: 0,
        approved: 0,
      });
    }
  };

  useEffect(() => {
    fetchContractBUSDBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
  }, [address, web3, chainId]);

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0xdF0833C041db53856380CF1e64CD6428A9e41D3d";
    return ref;
  };

  const reBake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.collectMoney().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);

    try {
      await contract.methods.withdrawMoney().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };

  const sellTower = async () => {
    setLoading(true);

    try {
      await contract.methods.sellTower().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };

  const upgradeTower0 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(0).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower1 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(1).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower2 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(2).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower3 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(3).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower4 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(4).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower5 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(5).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower6 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(6).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };
  const upgradeTower7 = async () => {
    setLoading(true);

    try {
      await contract.methods.upgradeTower(7).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };

  const basketfull = Math.trunc(((walletBalance.currentTime - walletBalance.timestamp) / 86400) * 100);
  const basketmeter = basketfull > 100 ? 100 : basketfull;

  return (
    <CardWrapper>
      {loading && <LinearProgress color="secondary" />}
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Your Money</Typography>
          <Typography variant="h5">{walletBalance.rewards}</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Your Money in YOSHITRUM</Typography>
          <Typography variant="h5">{walletBalance.rewards * 2e14 / 1e18}</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Money Per Hour</Typography>
          <Typography variant="h5">{walletBalance.yield}</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Money Basket</Typography>
          <Typography variant="h5">{basketmeter}% Full</Typography>
        </Grid>
        <Box paddingTop={4} paddingBottom={3}>
          <Divider />
          <ButtonContainer container>
            <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={eatBeans}
              >
                WITHDRAW MONEY
              </Button>
            </Grid>
          </ButtonContainer>
        </Box>
        <Divider />
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={reBake}
              >
                COLLECT MONEY
              </Button>
            </Grid>
          </ButtonContainer>
        <Divider />
        <Grid item flexGrow={3} marginTop={3}>
        <Typography variant="h5" borderBottom="6px solid" paddingBottom={1}>
          Yoshi Islands
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 1
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.hotDog} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield0[walletBalance.hotDog]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield0[walletBalance.hotDog]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.hotDog >= 5}
                onClick={upgradeTower0}
              >
                BUY FOR {chefCost0[walletBalance.hotDog]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 2
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.tacoTruck} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield1[walletBalance.tacoTruck]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield1[walletBalance.tacoTruck]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.tacoTruck >= 5}
                onClick={upgradeTower1}
              >
                BUY FOR {chefCost1[walletBalance.tacoTruck]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 3
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.doughnut} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield2[walletBalance.doughnut]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield2[walletBalance.doughnut]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.doughnut >= 5}
                onClick={upgradeTower2}
              >
                BUY FOR {chefCost2[walletBalance.doughnut]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 4
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.cake} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield3[walletBalance.cake]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield3[walletBalance.cake]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.cake >= 5}
                onClick={upgradeTower3}
              >
                BUY FOR {chefCost3[walletBalance.cake]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 5
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.hamburger} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield4[walletBalance.cake]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield4[walletBalance.cake]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.hamburger >= 5}
                onClick={upgradeTower4}
              >
                BUY FOR {chefCost4[walletBalance.hamburger]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 6
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.breakfast} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield5[walletBalance.breakfast]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield5[walletBalance.breakfast]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.breakfast >= 5}
                onClick={upgradeTower5}
              >
                BUY FOR {chefCost5[walletBalance.breakfast]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 7
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.hibachi} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield6[walletBalance.hibachi]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield6[walletBalance.hibachi]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.hibachi >= 5}
                onClick={upgradeTower6}
              >
                BUY FOR {chefCost6[walletBalance.hibachi]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
        <Typography variant="h6" borderBottom="6px solid" paddingBottom={2}>
        </Typography>
        <Typography variant="h6" align="center" paddingBottom={2}>
          Island 8
        </Typography>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Current Yoshis: {walletBalance.restaurant} / 5
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Money Per Hour: {floorYield7[walletBalance.restaurant]}
        </Typography>
        <br></br>
        <Typography variant="h7" align="left" paddingBottom={2}>
          Next Upgrade: {yield7[walletBalance.restaurant]}
        </Typography>
        <ButtonContainer>
        <Grid item flexGrow={3} marginTop={3}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || +walletBalance.restaurant >= 5}
                onClick={upgradeTower7}
              >
                BUY FOR {chefCost7[walletBalance.restaurant]} COINS
              </Button>
        </Grid>
        </ButtonContainer>
      </Grid>
      </CardContent>
    </CardWrapper>
  );
}
