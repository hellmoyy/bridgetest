import React from 'react'

function Thirdsection() {
    return (
        <>
            <div className="table-section">
                <div className="container">
                    <h3></h3>
                    <div className="row">
                        <div class="main-title-black">
                            <h2>My Stakes</h2>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                            <div className="rounded-tbl" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <table className="table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Interest</th>
                                            <th scope="col">Penalty</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">End Date</th>
                                            <th scope="col"></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ color: '#000000' }}>28-2-2022</td>
                                            <td>10000</td>
                                            <td>1200</td>
                                            <td>0.000</td>
                                            <td>2.928 Catecoin</td>
                                            <td>28-2-2022</td>
                                            <td><button type='button' className="sr-btn">withdraw</button></td>
                                        </tr>
                                        <tr>
                                            <td style={{ color: '#000000' }}>28-2-2022</td>
                                            <td>10000</td>
                                            <td>1200</td>
                                            <td>0.000</td>
                                            <td>2.928 Catecoin</td>
                                            <td>28-2-2022</td>
                                            <td><button type='button' className="sr-btn">withdraw</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Thirdsection
