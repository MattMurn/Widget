import React, { Component } from 'react';
import './Table.css';
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
            currentProduct: 'BTC-USD',
            netChange: '',
            midPoint: ''
        };
    };

    componentWillMount = () => {
        // this.getProducts();
        socket.on('products', this.getProducts)
        socket.on('initBook', this.initialBook)
    };

    componentDidMount = () => {
        socket.on('netChange', this.getInitNetChange)
        // socket.on('l2update', this.handleWsFeed) 
    };

    dropdownSelect = event => {
        let productSelect = {
            productCode: this.state.productHeader[event]
        };
        this.setProduct(productSelect);
        this.setState({currentProduct: productSelect.productCode});
        this.getInitNetChange();
    };

    getProducts = (data) => {
        this.setState({productHeader: data});
    };

    initialBook = feedData => {
        console.log("this is from initialBook", feedData.bids[0])
        this.setState({
            bidOnePrice: feedData.bids[0][0],
            bidOneSize: feedData.bids[0][1],
            bidTwoPrice: feedData.bids[2][0],
            bidTwoSize: feedData.bids[2][1],
            askOnePrice: feedData.asks[0][0],
            askOneSize: feedData.asks[0][1],
            askTwoPrice: feedData.asks[2][0],
            askTwoSize: feedData.asks[2][1],
        });
    };

    setProduct = productSelect => {
        socket.emit('updateProduct', productSelect);
    };

    getInitNetChange = data => {
        this.setState({netChange: data});
    };

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
        });
    }
 
    render = () => {
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
                        <tr className="currentProduct">{currentProduct}</tr>
                    </thead>
                    <tbody>
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
                        <th id="netChange">Net Change: {netChange}%</th>
                        <th id="midPoint">MidPoint: {midPoint}</th>
                        </tr>
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
