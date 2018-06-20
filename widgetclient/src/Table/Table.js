import React, { Component } from 'react';
import './Table.css';
import axios from 'axios';
const io = require('socket.io-client');
const socket = io.connect();

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productHeader: [],
            askPriceOne: "--",
            askPriceTwo: "--",
            askSizeOne: "--",
            askSizeTwo: "--",
            bidPriceOne: "--",
            bidPriceTwo: "--",
            bidSizeOne: "--",
            bidSizeTwo: "--",
            currentProduct: "BTC-USD",
            updates: []
        }
    }
    
    componentDidMount = () => {
        setInterval(this.getOrderBook, 351);
        // socket.on('getDataFeed', this.handleWsFeed);
    }

    btnClick = event => {
        let productSelect = {
            productCode: event.target.value
        };
        this.setState({currentProduct: productSelect.productCode})
        axios.post('/productSelect', productSelect);
    }

    getOrderBook = () => {
        axios.get('/orderbook').then(orderBook => {
            let order = orderBook.data[0];
            this.setState({
                productHeader: orderBook.data[2],
                askPriceOne: order.asks[0][0],
                askSizeOne: order.asks[0][1],
                bidPriceOne: order.bids[0][0],
                bidSizeOne: order.bids[0][1],
                askPriceTwo: order.asks[1][0],
                askSizeTwo: order.asks[1][1],
                bidPriceTwo: order.bids[1][0],
                bidSizeTwo: order.bids[1][1],
            })
         })
    }

    handleWsFeed = (data) => {
     //use l2update channel to update changes to intial orderbook.
    }
   
    render = () => {

        const { productHeader, askPriceOne, askPriceTwo, 
                askSizeOne,askSizeTwo, bidPriceOne, 
                bidPriceTwo, bidSizeOne, bidSizeTwo, currentProduct
            } = this.state;
            
        return(
            <div className="container"> 
                <table className="table table-dark">
                    <div className="btnBar"> 
                        {productHeader.map((product, i) => (
                            <button type= "button" className="productBtn btn btn-dark" value={product} onClick={this.btnClick} key={i} >{product}</button>
                        ))}
                    </div>
                    <thead>
                        <tr>
                            <h1 className="productStyle">{currentProduct} </h1>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="col" className="sideHeader">Ask</th>
                        </tr>
                        <tr>
                            <th scope="col">Price</th>
                            <th scope="col">Size</th>
                        </tr>
                        <tr>
                            <td>{askPriceTwo}</td>
                            <td>{askSizeTwo}</td>
                        </tr>
                        <tr>
                            <td>{askPriceOne}</td>
                            <td>{askSizeOne}</td>
                        </tr>
                        <tr>
                            <th scope="col" className="sideHeader">Bid</th>
                            <th scope="col" id="midPoint">MidPoint  - {(bidPriceOne*.5)+(askPriceOne*.5)}</th>
                        </tr>
                        <tr>
                            <th scope="col">Price</th>
                            <th scope="col">Size</th>
                        </tr>
                        <tr>
                            <td>{bidPriceOne}</td>
                            <td>{bidSizeOne}</td>
                        </tr>
                        <tr>
                            <td>{bidPriceTwo}</td>
                            <td>{bidSizeTwo}</td>
                        </tr>
                    </tbody>
                    <br/>
                </table>            
            </div>
        )
    }
}

export default Table;
