import React, { Component } from 'react';
import './Table.css';
import axios from 'axios';
import { DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import io from 'socket.io-client';
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
            currentProduct: '---',
            netChange: '',
            midPoint: ''
        };
    }

    componentWillMount = () => {
        this.getProducts();
        let i = 0;
        setInterval(() => {
            i++;
            console.log(i)
        },1000)
    }

<<<<<<< HEAD
    // btnClick = event => {
    //     let productSelect = {
    //         productCode: event.target.value
    //     };
    //     this.setState({currentProduct: productSelect.productCode})
    //     axios.post('/productSelect', productSelect);
    // }
=======
    dropdownSelect = event => {
        let productSelect = {
            productCode: this.state.productHeader[event]
        };
        this.setProduct(productSelect);
        this.setState({currentProduct: productSelect.productCode});
    }
>>>>>>> develop

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

    handleWsFeed = order => {
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
            <div className="buttonContainer">
                <ButtonToolbar>
                    <DropdownButton
                        bsStyle="default"
                        title="Select Product"
                        noCaret
                        id="dropdown-no-caret"
                    >
                        {productHeader.map((product, i) => (
                            <MenuItem 
                                eventKey= {i} 
                                onSelect={event => this.dropdownSelect(event)} 
                                value={product} 
                                key={i}> {product}
                            </MenuItem>
                        ))}
                    </DropdownButton>
                </ButtonToolbar>
            </div>
                <table className="table table-dark">    
                    <thead>
                        <tr className="currentProduct">
                            {currentProduct}
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <th scope="col" className="sideHeader">Ask</th>
                        </tr> */}
                        <tr className="askTable">
                            <th scope="col">Price</th>
                            <th scope="col">Size</th>
                        </tr>
                        <tr className="askTable">
                            <td>{askTwoPrice}</td>
                            <td>{askTwoSize}</td>
                        </tr>
                        <tr className="askTable">
                            <td>{askOnePrice}</td>
                            <td>{askOneSize}</td>
                        </tr>
                        <tr className="stats">
                        <th  id="netChange">Net Change: {netChange}%</th>
                        <th  id="midPoint">MidPoint: {midPoint}</th>
                        </tr>
                        {/* <tr>
                            <th scope="col" className="sideHeader">Bid</th>
                        </tr> */}
                        <tr className="bidTable">
                            <th scope="col">Price</th>
                            <th scope="col">Size</th>
                        </tr>
                        <tr className="bidTable">
                            <td>{bidOnePrice}</td>
                            <td>{bidOneSize}</td>
                        </tr>
                        <tr className="bidTable">
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
