/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import PriceInput from "../../components/PriceInput";
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

export default function BakeCard() {
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
      const [busdAmount, totalRestaurants, totalUsers,rewardsAmount = [], approvedAmount] = await Promise.all([
        getBusdBalance(address),
        contract.methods
        .totalTowers()
        .call()
        .catch((err) => {
          console.error("totaltowers", err);
          return 0;
        }),
        contract.methods
        .totalChefs()
        .call()
        .catch((err) => {
          console.error("totalchefs", err);
          return 0;
        }),
        contract.methods
          .towers(address)
          .call()
          .catch((err) => {
            console.error("towers", err);
            return 0;
          }),
        getBusdApproved(address),
      ]);
      setWalletBalance({
        busd: fromWei(`${busdAmount}`),
        owners: totalRestaurants,
        users: totalUsers,
        beans: rewardsAmount[0],
        rewards: rewardsAmount[1],
        approved: approvedAmount,
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

  const onUpdateBakeBUSD = (value) => {
    setBakeBUSD(value);
  };

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0xdF0833C041db53856380CF1e64CD6428A9e41D3d";
    return ref;
  };

  const bake = async () => {
    setLoading(true);

    const ref = getRef();
    const amount = toWei(`${bakeBUSD}`);

    try {
      await contract.methods.addCoins(amount).send({
        from: address,
        value: 0,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };

  const approve = async () => {
    setLoading(true);

    const lcontract = '0x0F4bbd177b9dC01A1930086c646BD1f40882f706';

    try {
      await busdcontract.methods.approve(lcontract,'1000000000000000000000000000000').send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
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
          <Typography variant="body1">Total Yoshis</Typography>
          <Typography variant="h5">{walletBalance.users}</Typography>
        </Grid>
      <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Total Islands</Typography>
          <Typography variant="h5">{walletBalance.owners}</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Contract</Typography>
          <Typography variant="h5">{contractBUSD} YOSHI</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Wallet</Typography>
          <Typography variant="h5">{walletBalance.busd} YOSHI</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Your Coins</Typography>
          <Typography variant="h5">{walletBalance.beans}</Typography>
        </Grid>
        <Box paddingTop={4} paddingBottom={3}>
          <Box>
            <PriceInput
              max={+walletBalance.busd}
              value={bakeBUSD}
              onChange={(value) => onUpdateBakeBUSD(value)}
            />
          </Box>
          <Box marginTop={3} marginBottom={3}>
          <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">You will Get</Typography>
          <Typography variant="h5">{bakeBUSD * 1e18 / 2e16}</Typography>
          </Grid>
          <br></br>
          <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || loading || +walletBalance.approved !== 0}
              onClick={approve}
            >
              Approve
            </Button>
          </Box>
          <Box marginTop={3} marginBottom={3}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBUSD === 0 || loading || +walletBalance.approved === 0}
              onClick={bake}
            >
              Buy Coins
            </Button>
          </Box>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
