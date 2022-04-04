import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Web3 from "web3";
import hdwallet from "@truffle/hdwallet-provider";

import useMetaMask from "../wallet/hook";
import { ETH_RPC, BSC_RPC } from "../wallet/connector";
import ETHBridge from "../Abi/ETH_BRIDGE.json";
import BSCBridge from "../Abi/BSC_BRIDGE.json";
import ETHToken from "../Abi/ETH_TOKEN.json";
import BSCToken from "../Abi/BSC_TOKEN.json";

function Secondsection() {
  const [network, setNetowrk] = useState(false);
  const { isActive, account, library } = useMetaMask();

  const [swapAmount, setSwapAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");

  const [ethBalance, setEthBalance] = useState("...");
  const [ethPOW, setEthPOW] = useState("");
  const [ethSymbol, setEthSymbol] = useState("DMC");

  const [bscBalance, setBscBalance] = useState("...");
  const [bscSymbol, setBscSymbol] = useState("DMC");
  const [bscPOW, setBscPOW] = useState("");

  const [loading, setLoading] = useState(false);
  const [ethAllowance, setEthAllowance] = useState(false);
  const [bscAllowance, setBscAllowance] = useState(false);

  const privateKey = '1e81559e35674a56063e5e38966368cffabad78c1743544604abc94f4cfe2380';
  console.log(privateKey);
  const notify = (isError, msg) => {
    if (isError) {
      toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const approve = async () => {
    setLoading(true);
    try {
      if (network) {
        var contract = new library.eth.Contract(
          BSCToken,
          "0x2C1525775ABF617f818e64b1B4e6Bdf252e6bAbB"
        );
        var Router = "0xeB4c43eCebD5cB713EDdDCf71395b2acDEdEa6eB";
      } else {
        var contract = new library.eth.Contract(
          ETHToken,
          "0xAAe3d23a76920C9064aeFDD571360289fcc80053"
        );
        var Router = "0x921E56C6b68ccD3b72c91589e987d64345E5168D";
      }
      var amountIn = 10 ** 69;
      amountIn = amountIn.toLocaleString("fullwide", { useGrouping: false });

      await contract.methods
        .approve(Router, amountIn.toString())
        .send({ from: account })
        .then(async () => {
          await loadUserData();
          notify(false, "enable token successfully");
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const swapBalance = async () => {
    setLoading(true);
    const ethProvider = new hdwallet(privateKey, ETH_RPC);
    const bscProvider = new hdwallet(privateKey, BSC_RPC);
    const ethWeb3 = new Web3(ethProvider);
    const bscWeb3 = new Web3(bscProvider);
    if (network) {
      var bscBridgeContract = new library.eth.Contract(
        BSCBridge,
        "0xeB4c43eCebD5cB713EDdDCf71395b2acDEdEa6eB"
      );
      var ethBridgeContract = new ethWeb3.eth.Contract(
        ETHBridge,
        "0x921E56C6b68ccD3b72c91589e987d64345E5168D"
      );
      var amount = swapAmount * bscPOW;
      amount = amount.toLocaleString("fullwide", { useGrouping: false });
      try {
        await bscBridgeContract.methods
          .swap(amount.toString())
          .send({ from: account })
          .then(async () => {
            await ethBridgeContract.methods
              .tokenMint(account, amount)
              .send({ from: ethProvider.getAddress(0) })
              .then(() => {
                notify(false, "token send successfully ETH network");
                loadUserData();
              });
          });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      var ethBridgeContract = new library.eth.Contract(
        ETHBridge,
        "0x921E56C6b68ccD3b72c91589e987d64345E5168D"
      );
      var bscBridgeContract = new bscWeb3.eth.Contract(
        BSCBridge,
        "0xeB4c43eCebD5cB713EDdDCf71395b2acDEdEa6eB"
      );
      var amt = swapAmount * 0.1;
      var final_amt = swapAmount - amt;
      var amount = final_amt * bscPOW;
      amount = amount.toLocaleString("fullwide", { useGrouping: false });
      try {
        await ethBridgeContract.methods
          .swap(amount.toString())
          .send({ from: account })
          .then(async () => {
            await bscBridgeContract.methods
              .tokenMint(account, amount)
              .send({ from: bscProvider.getAddress(0) })
              .then(() => {
                notify(false, "token send successfully to BSC network");
                loadUserData();
              });
          });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const loadUserData = async () => {
    setLoading(true);
    const ethWeb3 = new Web3(ETH_RPC);
    const bscWeb3 = new Web3(BSC_RPC);

    var ethToken = new ethWeb3.eth.Contract(
      ETHToken,
      "0xAAe3d23a76920C9064aeFDD571360289fcc80053"
    );
    var bscToken = new bscWeb3.eth.Contract(
      BSCToken,
      "0x2C1525775ABF617f818e64b1B4e6Bdf252e6bAbB"
    );

    var ethallowance = await ethToken.methods
      .allowance(account, "0x921E56C6b68ccD3b72c91589e987d64345E5168D")
      .call();
    var ethBalance = await ethToken.methods.balanceOf(account).call();
    var ethDecimals = await ethToken.methods.decimals().call();
    var ethSymbol = await ethToken.methods.symbol().call();
    var ethPOW = Math.pow(10, ethDecimals);
    setEthBalance((ethBalance / ethPOW).toFixed(5));
    setEthPOW(ethPOW);
    setEthSymbol(ethSymbol);
    if (ethallowance <= 2) {
      setEthAllowance(true);
    }

    var bscallowance = await bscToken.methods
      .allowance(account, "0xeB4c43eCebD5cB713EDdDCf71395b2acDEdEa6eB")
      .call();
    var bscBalance = await bscToken.methods.balanceOf(account).call();
    var bscDecimals = await bscToken.methods.decimals().call();
    var bscSymbol = await bscToken.methods.symbol().call();
    var bscPOW = Math.pow(10, bscDecimals);
    setBscBalance((bscBalance / bscPOW).toFixed(5));
    setBscPOW(bscPOW);
    setBscSymbol(bscSymbol);
    if (bscallowance <= 2) {
      setBscAllowance(true);
    }

    setLoading(false);
  };

  const switchNetwork = async (network) => {
    setLoading(true);
    if (network) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }], // chainId must be in hexadecimal numbers
      });
    } else {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4" }], // chainId must be in hexadecimal numbers
      });
    }
    if (isActive) {
      loadUserData();
    }
  };

  useEffect(() => {
    if (isActive) {
      loadUserData();
    }
  }, [isActive]);
  useEffect(() => {
    switchNetwork(false);
  }, []);
  return (
    <div>
      <div className="stack-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-sm-12 col-xl-12">
              <div className="checkout-form-centre">
                <div className="checkout-login-step">
                  <h2>BTO Bridge token</h2>
                  <div className="box-section">
                    {network === false ? (
                      <>
                        <div className="balence">
                          <button type="button">
                            <p>
                              your balance {ethBalance} {ethSymbol}
                            </p>
                            <div style={{ display: "flex" }}>
                              <div className="round">
                                <div className="box">
                                  <label>
                                    <input
                                      type="text"
                                      disabled={loading}
                                      onChange={(e) => {
                                        setSwapAmount(
                                          parseFloat(e.target.value)
                                        );
                                        var amt =
                                          parseFloat(e.target.value) * 0.1;
                                        setOutputAmount(
                                          parseFloat(e.target.value) - amt
                                        );
                                      }}
                                    />
                                  </label>
                                  <div className="icon">
                                    <img src="images/icon.png" alt="" />
                                    <span>{ethSymbol}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="right-side-icon">
                                <div className="icon-round">
                                  <img src="images/eth-icon.png" alt="" />
                                  <span>ETH</span>
                                </div>
                              </div>
                            </div>
                          </button>
                          <div className="font-icon">
                            <img
                              src="images/icon-2.png"
                              alt=""
                              onClick={() => {
                                setNetowrk(true);
                                switchNetwork(true);
                              }}
                            />
                          </div>
                          <button type="button">
                            <p>
                              your balance {bscBalance} {bscSymbol}
                            </p>
                            <div style={{ display: "flex" }}>
                              <div className="round">
                                <div className="box">
                                  <label>{outputAmount}</label>
                                  <div className="icon">
                                    <img src="images/icon.png" alt="" />
                                    <span>{bscSymbol}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="right-side-icon">
                                <div className="icon-round">
                                  <img src="images/bsc-icon.png" alt="" />
                                  <span>BSC</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="balence">
                          <button type="button">
                            <p>
                              your balance {bscBalance} {bscSymbol}
                            </p>
                            <div style={{ display: "flex" }}>
                              <div className="round">
                                <div className="box">
                                  <label>
                                    <input
                                      type="text"
                                      disabled={loading}
                                      onChange={(e) => {
                                        setSwapAmount(
                                          parseFloat(e.target.value)
                                        );
                                        var amt =
                                          parseFloat(e.target.value) * 0.1;
                                        setOutputAmount(
                                          parseFloat(e.target.value) - amt
                                        );
                                      }}
                                    />
                                  </label>
                                  <div className="icon">
                                    <img src="images/icon.png" alt="" />
                                    <span>{bscSymbol}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="right-side-icon">
                                <div className="icon-round">
                                  <img src="images/bsc-icon.png" alt="" />
                                  <span>BSC</span>
                                </div>
                              </div>
                            </div>
                          </button>

                          <div className="font-icon">
                            <img
                              src="images/icon-1.png"
                              alt=""
                              onClick={() => {
                                setNetowrk(false);
                                switchNetwork(false);
                              }}
                            />
                          </div>
                          <button type="button">
                            <p>
                              your balance {ethBalance} {ethSymbol}
                            </p>
                            <div style={{ display: "flex" }}>
                              <div className="round">
                                <div className="box">
                                  <label>{outputAmount}</label>
                                  <div className="icon">
                                    <img src="images/icon.png" alt="" />
                                    <span>{ethSymbol}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="right-side-icon">
                                <div className="icon-round">
                                  <img src="images/eth-icon.png" alt="" />
                                  <span>ETH</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </>
                    )}

                    {isActive ? (
                      network ? (
                        bscAllowance ? (
                          <button
                            onClick={() => approve()}
                            disabled={loading}
                            type="button"
                            className="swap"
                          >
                            {loading ? "Please wait, Loading.." : "Enable"}
                          </button>
                        ) : (
                          <button
                            onClick={() => swapBalance()}
                            disabled={loading}
                            type="button"
                            className="swap"
                          >
                            {loading ? "Please wait, Loading.." : "swap"}
                          </button>
                        )
                      ) : ethAllowance ? (
                        <button
                          onClick={() => approve()}
                          disabled={loading}
                          type="button"
                          className="swap"
                        >
                          {loading ? "Please wait, Loading.." : "Enable"}
                        </button>
                      ) : (
                        <button
                          onClick={() => swapBalance()}
                          disabled={loading}
                          type="button"
                          className="swap"
                        >
                          {loading ? "Please wait, Loading.." : "swap"}
                        </button>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Secondsection;
