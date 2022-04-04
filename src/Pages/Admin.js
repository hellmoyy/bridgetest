import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useMetaMask from "../wallet/hook";

import ETHBridge from "../Abi/ETH_BRIDGE.json";
import BSCBridge from "../Abi/BSC_BRIDGE.json";
import BSC_TOKEN from "../Abi/BSC_TOKEN.json";
import ETH_TOKEN from "../Abi/ETH_TOKEN.json";
function Admin() {
  const navigate = useNavigate();
  const { isActive, shouldDisable, account, library } = useMetaMask();

  const [network, setNetwork] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [balance, setBalance] = useState(0);
  const [owner, setOwner] = useState(0);
  const [tokenAddres, setTokenAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

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

  const unpaused = async () => {
    setLoading(true);
    var bridgeContract;
    if (network === "0x4") {
      bridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );
    } else {
      bridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );
    }
    try {
      await bridgeContract.methods
        .allowSwap()
        .send({ from: account })
        .then((result) => {
          notify(false, "Unpaused successfully");
          setPaused(false);
        });
    } catch (e) {
      notify(true, e.message);
    }

    setLoading(false);
  };

  const pausedSwap = async () => {
    setLoading(true);
    var bridgeContract;
    if (network === "0x4") {
      bridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );
    } else {
      bridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );
    }
    try {
      await bridgeContract.methods
        .pausedSwap()
        .send({ from: account })
        .then((result) => {
          notify(false, "paused successfully");
          setPaused(false);
        });
    } catch (e) {
      notify(true, e.message);
    }

    setLoading(false);
  };

  const withdrawNativeCurrency = async () => {
    setLoading(true);
    var bridgeContract;
    if (network === "0x4") {
      bridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );
    } else {
      bridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );
    }
    try {
      await bridgeContract.methods
        .withdrawNativeCurrency()
        .send({ from: account })
        .then((result) => {
          notify(false, "withdrawNativeCurrency successfully");
          setPaused(false);
        });
    } catch (e) {
      notify(true, e.message);
    }

    setLoading(false);
  };

  const withdrawToken = async () => {
    if (tokenAddres === "" && withdrawAmount === "") {
      notify(false, "enter tokenAddresss or amount");
      return;
    }
    setLoading(true);
    var bridgeContract, tokenContract;
    if (network === "0x4") {
      bridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );
      tokenContract = new library.eth.Contract(BSC_TOKEN, tokenAddres);
    } else {
      bridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );

      tokenContract = new library.eth.Contract(ETH_TOKEN, tokenAddres);
    }
    var decimals = await tokenContract.methods.decimals().call();
    var pow = 10 ** decimals;
    var amt = withdrawAmount * pow;

    var BN = library.utils.BN;
    var amountInNew = new BN(amt.toString());

    try {
      await bridgeContract.methods
        .withdrawToken(tokenAddres, amountInNew.toString())
        .send({ from: account })
        .then((result) => {
          notify(false, "withdrawToken successfully");
          // setPaused(false);
          setWithdrawAmount("");
          setTokenAddress("");
        });
    } catch (e) {
      notify(true, e.message);
    }

    setLoading(false);
  };

  const upgradeOwner = async () => {
    if (owner === "") {
      notify(false, "enter new ownerAddresss");
      return;
    }
    setLoading(true);
    var bridgeContract;
    if (network === "0x4") {
      bridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );
    } else {
      bridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );
    }

    try {
      await bridgeContract.methods
        .upgradeOwner(owner.toString())
        .send({ from: account })
        .then((result) => {
          notify(false, "ownerAddress change successfully");
          setOwner("");
        });
    } catch (e) {
      notify(true, e.message);
    }

    setLoading(false);
  };

  const loadUserData = async () => {
    setLoading(true);

    var network = window.ethereum.chainId;
    setNetwork(network);
    setLoading(false);
    var balance;
    if (network === "0x38") {
      var bscBridgeContract = new library.eth.Contract(
        BSCBridge,
        process.env.REACT_APP_BSC_BRIDGE
      );
      // var paused = await bscBridgeContract.methods.paused().call();
      balance = await bscBridgeContract.methods.balanceOf().call();
      // setPaused(paused);
      setBalance(balance);
    } else {
      var ethBridgeContract = new library.eth.Contract(
        ETHBridge,
        process.env.REACT_APP_ETH_BRIDGE
      );
      // var paused = await ethBridgeContract.methods.paused().call();
      balance = await ethBridgeContract.methods.balanceOf().call();
      // setPaused(paused);
      setBalance(balance);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isActive && !shouldDisable) {
      if (account !== process.env.REACT_APP_ADMIN_ADDRESS) {
        navigate("/");
      }
      loadUserData();
    } else {
    }
  }, [isActive]);

  return (
    <>
      <Navbar />
      <div className="stack-section">
        <div className="container">
          <div className="row">
            <div class="col-md-12 col-lg-12 col-sm-12 col-xl-12">
              <div className="col-md-12 col-lg-12 col-sm-12 col-xl-12">
                <div className="checkout-form-centre">
                  <div className="checkout-login-step">
                    {network === "0x38" ? (
                      <h2>BSC Detail</h2>
                    ) : (
                      <h2>ETH Detail</h2>
                    )}
                  </div>
                  <br />
                  <div className="box-section">
                    <div className="balence">
                      <div className="row">
                        <div className="col-md-4">
                          <p style={{ color: "#fff" }}>
                            BTO Balance:- {balance / 10 ** 18}
                          </p>
                        </div>
                        <div className="col-md-8">
                          <button
                            className="primary_btn_my"
                            disabled={loading}
                            onClick={() => withdrawNativeCurrency()}
                          >
                            {loading
                              ? "Please wait..."
                              : "withdraw NativeCurrency"}
                          </button>

                          {paused ? (
                            <button
                              className="primary_btn_my"
                              disabled={loading}
                              onClick={() => pausedSwap()}
                            >
                              {loading ? "Please wait..." : "unpause"}
                            </button>
                          ) : (
                            <button
                              className="primary_btn_my"
                              disabled={loading}
                              onClick={() => unpaused()}
                            >
                              {loading ? "Please wait..." : "pause"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <p style={{ color: "#fff",marginBottom:"3px",marginTop:"10px" }}>withdraw Token</p>
                          <input
                            className="form-control mb-2 mt-3"
                            placeholder="enter token contractAddress"
                            onChange={(e) => setTokenAddress(e.target.value)}
                          />
                          <input
                            className="form-control mb-3"
                            placeholder="enter token amount"
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />

                          <button
                            className="primary_btn_my"
                            disabled={loading}
                            onClick={() => withdrawToken()}
                          >
                            {loading ? "Please wait..." : "withdrawToken"}
                          </button>
                        </div>
                        <div className="col-md-6">
                          <p style={{ color: "#fff",marginBottom:"3px",marginTop:"10px" }}>Change Owner</p>
                          <input
                            className="form-control mb-2 mt-3"
                            placeholder="enter token contractAddress"
                            onChange={(e) => setOwner(e.target.value)}
                          />

                          <button
                            className="primary_btn_my"
                            disabled={loading}
                            onClick={() => upgradeOwner()}
                          >
                            {loading ? "Please wait..." : "Change Owner"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
}

export default Admin;
