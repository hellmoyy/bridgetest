import React from 'react'
import { Link } from "react-router-dom";
function Login() {
    return (
        <div>
            <section className="home-page-first-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-6 col-xl-6  pr-md-6 align-self-center text-center text-md-left content">
                            <div className="sr-btn-wrap">
                                <Link to="/" className="sr-btn-2">
                                    <i className="fa fa-arrow-left"></i>
                                </Link>
                                <div className="go-back-title">Go Back</div>
                            </div>
                            <div className="connect-wallet">
                                <h1>Please Connect Your Wallet</h1>
                                <p>Sign in with one of available wallet providers or<br /> create a new wallet. <a href="#"> What is a
                                    wallet?</a> </p>
                                <div className="sr-btn-wrap1">
                                    <a href="#" className="sr-btn">Trust Wallet</a>
                                    <a href="#" className="sr-btn active">Metamask</a>
                                    <a href="#" className="sr-btn">Binance</a>
                                </div>
                                <h6>We do not own your private keys and cannot access<br /> your funds without your confirmation.</h6>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-6 col-xl-6 p-0 image"><img src="images/login.png" className="fit-image" alt="" /></div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
