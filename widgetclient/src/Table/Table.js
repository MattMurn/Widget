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
        // setInterval(this.getOrderBook, 501);
        socket.on('getDataFeed', this.handleWsFeed);
    }

    btnClick = event => {
        let productSelect = {
            productCode: event.target.value
        };
        this.setState({currentProduct: productSelect.productCode})
        axios.post('/productSelect', productSelect);
    }

    // getOrderBook = () => {
    //     axios.get('/orderbook').then(orderBook => {
    //         let order = orderBook.data[0];
    //         this.setState({
    //             productHeader: orderBook.data[2],
    //             askPriceOne: order.asks[0][0],
    //             askSizeOne: order.asks[0][1],
    //             bidPriceOne: order.bids[0][0],
    //             bidSizeOne: order.bids[0][1],
    //             askPriceTwo: order.asks[1][0],
    //             askSizeTwo: order.asks[1][1],
    //             bidPriceTwo: order.bids[1][0],
    //             bidSizeTwo: order.bids[1][1],
    //         })
    //      })
    // }

    handleWsFeed = (order) => {
        console.log(order.askTwoSize)
        this.setState({
            askOnePrice: order.askOnePrice,
            askOneSize: order.askOneSize,
            askTwoPrice: order.askTwoPrice,
            askTwoSize: order.askTwoSize,
            bidOnePrice: order.bidOnePrice,
            bidOneSize: order.bidOneSize,
            bidTwoPrice: order.bidTwoPrice,
            bidTwoSize: order.bidTwoSize,
        })
     //use l2update channel to update changes to intial orderbook.
    }
   
    render = () => {

        const { productHeader, askOnePrice, askTwoPrice, 
                askOneSize,askTwoSize, bidOnePrice, 
                bidTwoPrice, bidOneSize, bidTwoSize, currentProduct
            } = this.state;
            
        return(
            <div className="container"> 
                <table className="table table-dark">
                    
                    <thead>
                        <tr className="btnBar"> 
                            {productHeader.map((product, i) => (
                                <button type= "button" className="productBtn btn btn-dark" value={product} onClick={this.btnClick} key={i} >{product}</button>
                            ))}
                        </tr>
                        <tr>
                            <th className="productStyle">{currentProduct} </th>
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
                            <td>{askTwoPrice}</td>
                            <td>{askTwoSize}</td>
                        </tr>
                        <tr>
                            <td>{askOnePrice}</td>
                            <td>{askOneSize}</td>
                        </tr>
                        <tr>
                            <th scope="col" className="sideHeader">Bid</th>
                            <th scope="col" id="midPoint">MidPoint  - {(bidOnePrice*.5)+(askOnePrice*.5)}</th>
                        </tr>
                        <tr>
                            <th scope="col">Price</th>
                            <th scope="col">Size</th>
                        </tr>
                        <tr>
                            <td>{bidOnePrice}</td>
                            <td>{bidOneSize}</td>
                        </tr>
                        <tr>
                            <td>{bidTwoPrice}</td>
                            <td>{bidTwoSize}</td>
                        </tr>
                    </tbody>
                </table>            
            </div>
        )
    }
}

export default Table;
