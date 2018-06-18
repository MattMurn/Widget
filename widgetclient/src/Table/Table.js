import React, { Component } from 'react';
import { getDataFeed } from '../websocketApi';
import './Table.css'
// import { getDefaultSettings } from 'http2';
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
class Table extends Component {
    constructor(props) {
        super(props)
      

// 


        this.state = {
            productHeader: "default",
            askPriceOne: 100,
            askPriceTwo: 101,
            askSizeOne: 1,
            askSizeTwo: 499,
            bidPriceOne: 99,
            bidPriceTwo: 98,
            bidSizeOne: 100,
            bidSizeTwo: 19,
            test: []
        }
       
        
        socket.on('getDataFeed', this.handleFeed);
    }

    componentDidMount = () => {
        
    }
   
    getPercentChange = () => {

    }
  
    handleFeed = (data) => {
      
        if(data === undefined || data.changes === undefined){
            console.log("data.changes[0][1]");            
        }else {

            let updatedPrice =  data.changes[0][1];
            this.setState({bidPriceOne:updatedPrice,
                bidSizeOne: data.changes[0][2]
                    });
        }
        
        console.log(this.state.bidPriceOne)
    }
    render = () => {
        // console.log(getDataFeed('getDataFeed'))
        console.log(this.state.bidPriceOne)

        const { productHeader, askPriceOne, askPriceTwo, 
                askSizeOne,askSizeTwo, bidPriceOne, 
                bidPriceTwo, bidSizeOne, bidSizeTwo
            } = this.state;
        return(
            <div className="container"> 
                <div className="productHeader">{productHeader}</div>
                <div className="price"> Price </div>
                <div className="size"> Size </div>
                <div className="ask">
                    <div className="price"> {askPriceTwo} </div>
                    <div className="size"> {askSizeTwo} </div>
                    <div className="price"> {askPriceOne} </div>
                    <div className="size">{askSizeOne}</div>
                </div>
                <div className="midpoint">{(askPriceOne + bidPriceOne)/ 2}</div>
                <div className="bid">
                    <div className="price"> {bidPriceOne} </div>
                    <div className="size"> {bidSizeOne} </div>
                    <div className="price"> {bidPriceTwo} </div>
                    <div className="size"> {bidSizeTwo} </div>
                </div>
            </div>
        )
    }
}

export default Table;