import React, { Component } from 'react';
import './Table.css';
import axios from 'axios';
const io = require('socket.io-client');
const socket = io.connect();

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productHeader: [],
            askPriceOne: '--',
            askPriceTwo: '--',
            askSizeOne: '--',
            askSizeTwo: '--',
            bidPriceOne: '--',
            bidPriceTwo: '--',
            bidSizeOne: '--',
            bidSizeTwo: '--',
            currentProduct: 'BTC-USD',
            openPrice: '',
            netChange: '',
            midPoint: ''
        };
    }

    componentDidMount = () => {
        this.getProducts();
        this.openPrice();
    }

    btnClick = event => {
        socket.disconnect();
        let productSelect = {
            productCode: event.target.value
        };
        this.setProduct(productSelect);
        this.setState({currentProduct: productSelect.productCode});
        socket.connect();
    }

    getProducts = () => {
        axios.get('/products').then(product => {
            this.setState({productHeader: product.data});
        });
    }

    setProduct = productSelect => {
        axios.post('/productSelect', productSelect)
        .then(
            socket.on('getDataFeed', this.handleWsFeed)
        );
    }

    openPrice = () => {
        axios.get('/openPrice').then(opening => {
            this.setState({openPrice: opening.data})
        })
    }

    handleWsFeed = (order) => {
        this.setState({
            askOnePrice: order.askOnePrice,
            askOneSize: order.askOneSize,
            askTwoPrice: order.askTwoPrice,
            askTwoSize: order.askTwoSize,
            bidOnePrice: order.bidOnePrice,
            bidOneSize: order.bidOneSize,
            bidTwoPrice: order.bidTwoPrice,
            bidTwoSize: order.bidTwoSize,
            netChange: order.netChange,
            midPoint: order.midPoint
        })
    }
   
    render = () => {
        //add productHeader back in once multiple product sockets going.
        const { productHeader, askOnePrice, askTwoPrice, 
                askOneSize,askTwoSize, bidOnePrice, 
                bidTwoPrice, bidOneSize, bidTwoSize, currentProduct,
                netChange, midPoint
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
                        <th scope="col" id="midPoint">Net Change - {netChange}%</th>
                        <th scope="col" id="midPoint">MidPoint  - {midPoint}</th>
                        </tr>
                        <tr>
                            <th scope="col" className="sideHeader">Bid</th>
                            
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
