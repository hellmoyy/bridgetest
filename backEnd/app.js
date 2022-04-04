require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const port = process.argv[2] || 4001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");
// Bridge
mongoose.connect(`${process.env.DB_URL}`, {
  useNewUrlParser: true,
});
const db = mongoose.connection;

const hdwallet = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

var fs = require("fs");

var BSC_BRIDGE = __dirname + "/abi/BSC_BRIDGE.json";
var BSC_BRIDGE_ABI = JSON.parse(fs.readFileSync(BSC_BRIDGE));

var ETH_BRIDGE = __dirname + "/abi/ETH_BRIDGE.json";
var ETH_BRIDGE_ABI = JSON.parse(fs.readFileSync(ETH_BRIDGE));

const Transaction = require("./transaction");

app.post("/", async (req, res) => {
  var { type, hash } = req.body;
  try {
    var getTransaction = await Transaction.findOne({
      fromTransactionHash: hash,
    });

    if (getTransaction) {
      return res.json({
        status: false,
        msg: "invalid transactionHash",
      });
    }

    if (type === "BSC") {
      var provider = new hdwallet(process.env.privateKey, process.env.BSC_RPC);
      var web3 = new Web3(provider);

      var ethProvider = new hdwallet(
        process.env.privateKey,
        process.env.ETH_RPC
      );
      var ethWeb3 = new Web3(ethProvider);
      var bridgeContract = new ethWeb3.eth.Contract(
        ETH_BRIDGE_ABI,
        process.env.ethBridgeAddress
      );
    } else {
      var provider = new hdwallet(process.env.privateKey, process.env.ETH_RPC);
      var web3 = new Web3(provider);

      var bscProvider = new hdwallet(
        process.env.privateKey,
        process.env.BSC_RPC
      );
      var bscWeb3 = new Web3(bscProvider);
      var bridgeContract = new bscWeb3.eth.Contract(
        BSC_BRIDGE_ABI,
        process.env.bscBridgeAddress
      );
    }

    const getTransactionReceipt = await web3.eth.getTransactionReceipt(hash);
    var decodeData = web3.eth.abi.decodeParameters(
      ["uint256"],
      getTransactionReceipt.logs[0].data
    );
    
    if (
      getTransactionReceipt.to === process.env.ethBridgeAddress ||
      getTransactionReceipt.to === process.env.bscBridgeAddress
    ) {
      var pow = 10 ** 18;
      var inputAmt = decodeData[0] / pow;
      var amt = inputAmt * 0.06;
      var outputAmount = inputAmt - amt;
      var final_amt = outputAmount * pow;

      var insertTx = { fromTransactionHash: hash, type: type };

      await bridgeContract.methods
        .tokenMint(getTransactionReceipt.from, `${BigInt(final_amt)}`)
        .send({ from: provider.getAddress(0) })
        .then(async (result) => {
          insertTx.toTransactionHash = result.transactionHash;
          const transaction = new Transaction(insertTx);
          await transaction.save();
          return res.json({
            status: true,
            hash: result,
          });
        });
    } else {
      return res.json({
        status: false,
        msg: "invalid transactionHash",
      });
    }
  } catch (err) {
    return res.json({
      status: false,
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
