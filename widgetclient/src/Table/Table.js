import React, { Component } from 'react';
import { getDataFeed } from '../websocketApi';
import './Table.css';
import axios from 'axios';
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productHeader: "--",
            askPriceOne: "--",
            askPriceTwo: "--",
            askSizeOne: "--",
            askSizeTwo: "--",
            bidPriceOne: "--",
            bidPriceTwo: "--",
            bidSizeOne: "--",
            bidSizeTwo: "--",
            updates: []
        }
    }
    componentDidMount = () => {
        // console.log("component did mount")
        this.getOrderBook();
        // socket.on('getDataFeed', this.handleWsFeed);
    }
    getOrderBook = () => {
        axios.get('/orderbook').then( orderBook => {
            console.log(orderBook)
            let order = orderBook.data[0];
            this.setState({
                productHeader: orderBook.data[1],
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
    getPercentChange = () => {

    }
    topOfBookChange = (data) => {
        
    }
    handleWsFeed = (data) => {
        
        while(data.changes !== undefined){
            let update =  data.changes[0];
            let test = parseInt(update[1]);
            let final = test.toFixed(2);
            // console.log("undefined");
            this.getOrderBook();
            if(final === this.state.askPriceOne){
                console.log(` update price ${final}, state price ${this.state.askPriceOne}`)
                
                this.setState({askSizeOne: update[2]});

            }
            
            
        }
    }
   
    render = () => {
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
                <div className="midpoint">{50/ 2}</div>
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

 // console.log(data.changes[0])
            // this.getLevelOne(data);
            // let topOfBook = this.state.askPriceOne
            
            // console.log(data.changes.length)
            // console.log(updatedPrice)
           

        //     this.setState({askPriceOne: Math.round(updatedPrice[0][1] * 1000) / 1000,
        //         askSizeOne: data.changes[0][2]
        //             });
        // }else if(data.type === 'l2update' && data.changes[0][0] === 'buy'){
        //     this.setState({bidPriceOne: Math.round(updatedPrice[0][1] * 1000) / 1000,
        //         bidSizeOne: data.changes[0][2]
        //             });

         // getLevelOne = (data) => {
    //     if (data.type === 'ticker'){
    //         this.setState({
    //             askPriceOne: data.best_ask,
    //             bidPriceOne: data.best_bid})
    //     }
    //     if(data.changes !== undefined && data.changes[0][0] === 'sell') {
    //         this.setState({
    //             askSizeOne: data.changes[0][1]
            
    //         })
    //     }
    //     console.log(data.changes)
    //     console.log(this.state.askSizeOne)
    // }