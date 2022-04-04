import React from 'react'

function Footer() {
    return (
        <div>
            <div className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-md-2 col-xl-2 col-sm-6">
                            <div className='footer-logo'>
                                <img src="images/logo.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-10 col-md-10 col-xl-10 col-sm-6">
                            <div className="footer-links">
                               <ul>
                                   <li>
                                       <button type='button'>Link 1</button>
                                   </li>
                                   <li>
                                       <button type='button'>Link 2</button>
                                   </li>
                                   <li>
                                       <button type='button'>Link 3</button>
                                   </li>
                               </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
