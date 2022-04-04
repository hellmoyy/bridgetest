import React, { useEffect, useState } from "react";
import { HalfMalf } from "react-spinner-animated";

import "react-spinner-animated/dist/index.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Web3 from "web3";
import axios from "axios";

import useMetaMask from "../wallet/hook";
import { ETH_RPC, BSC_RPC, API_URL } from "../wallet/connector";
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
  const [percentage, setPercentage] = useState(process.env.REACT_APP_PERCENTAGE / 100);
  const [ethSymbol, setEthSymbol] = useState("DMC");

  const [bscBalance, setBscBalance] = useState("...");
  const [bscSymbol, setBscSymbol] = useState("DMC");
  const [bscPOW, setBscPOW] = useState("");

  const [loading, setLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [ethAllowance, setEthAllowance] = useState(false);
  const [bscAllowance, setBscAllowance] = useState(false);

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
      var contract;
      var Router;
      if (network) {
        contract = new library.eth.Contract(
          BSCToken,
          process.env.REACT_APP_BSC_TOKEN
        );
        Router = process.env.REACT_APP_BSC_BRIDGE;
      } else {
        contract = new library.eth.Contract(
          ETHToken,
          process.env.REACT_APP_ETH_TOKEN
        );
        Router = process.env.REACT_APP_ETH_BRIDGE;
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
    setSwapLoading(true);
    var amount,BN,amountIn;
    if (network) {
      var bscBridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );

      amount = swapAmount * bscPOW;
      BN = library.utils.BN;
      amountIn = new BN(amount.toString());
      // amount = amount.toLocaleString("fullwide", { useGrouping: false });
      try {
        await bscBridgeContract.methods
          .swap(amountIn.toString())
          .send({ from: account })
          .then(async (result) => {
            await axios
              .post(API_URL, {
                type: "BSC",
                hash: result.transactionHash,
              })
              .then(function (response) {
                notify(false, "token send successfully to BSC network");
                setSwapAmount("");
                setOutputAmount("");
                loadUserData();
              })
              .catch(function (error) {
                console.log(error);
              });
          });
        setLoading(false);
        setSwapLoading(false);
      } catch (e) {
        notify(true, e.message);
        setSwapLoading(false);
        setLoading(false);
      }
    } else {
      var ethBridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );

      amount = swapAmount * bscPOW;
      BN = library.utils.BN;
      amountIn = new BN(amount.toString());
      // amount = amount.toLocaleString("fullwide", { useGrouping: false });
      try {
        await ethBridgeContract.methods
          .swap(amountIn.toString())
          .send({ from: account })
          .then(async (result) => {
            await axios
              .post(API_URL, {
                type: "ETH",
                hash: result.transactionHash,
              })
              .then(function (response) {
                notify(false, "token send successfully to BSC network");
                setSwapAmount("");
                setOutputAmount("");
                loadUserData();
              })
              .catch(function (error) {
                console.log(error);
              });
          });
        setLoading(false);
        setSwapLoading(false);
      } catch (e) {
        // console.log(e);
        notify(true, e.message);
        setSwapLoading(false);
        setLoading(false);
      }
    }
  };

  const loadUserData = async () => {
    setLoading(true);
    const ethWeb3 = new Web3(ETH_RPC);
    const bscWeb3 = new Web3(BSC_RPC);

    var ethToken = new ethWeb3.eth.Contract(
      ETHToken,
      process.env.REACT_APP_ETH_TOKEN
    );
    var bscToken = new bscWeb3.eth.Contract(
      BSCToken,
      process.env.REACT_APP_BSC_TOKEN
    );

    var ethallowance = await ethToken.methods
      .allowance(account, process.env.REACT_APP_ETH_BRIDGE)
      .call();
    var ethBalance = await ethToken.methods.balanceOf(account).call();
    var ethDecimals = await ethToken.methods.decimals().call();
    var ethSymbol = await ethToken.methods.symbol().call();
    var ethPOW = Math.pow(10, ethDecimals);
    setEthBalance((ethBalance / ethPOW).toFixed(5));
    // setEthPOW(ethPOW);
    setEthSymbol(ethSymbol);
    if (ethallowance <= 2) {
      setEthAllowance(true);
    }

    var bscallowance = await bscToken.methods
      .allowance(account, process.env.REACT_APP_BSC_BRIDGE)
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
        params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
      });
    } else {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }], // chainId must be in hexadecimal numbers
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
  }, [isActive,account]);
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
                                          parseFloat(e.target.value) * percentage;
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
                                          parseFloat(e.target.value) * percentage;
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
      <div
        // className={`modal ${swapLoading ? "show" : ""}`}
        id="myModal"
        style={{
          display: `${swapLoading ? "block" : "none"}`,
        }}
      >
        {/* <div className="modal-dialog"> */}
        {/* <div className="modal-content" style={{border:"0px"}}> */}
        {/* <div className="modal-body"> */}
        <HalfMalf
          text={
            "do not close or refresh this window while transaction processing"
          }
          bgColor={"#ffff"}
          width={"250px"}
          height={"250px"}
          center={true}
        />
        {/* </div> */}
        {/* </div> */}
        {/* </div> */}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Secondsection;
