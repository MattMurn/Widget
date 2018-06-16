import React, { Component } from 'react';
import './Table.css'
import axios from 'axios';


class Table extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount = () => {
        this.getGDaxFeed()
    }
    getGDaxProducts = () => {
               

    }
    getGDaxFeed = () => {
        axios.get('/dataFeed', result => console.log(result))
        // websocket.connect();
        // websocket.subscribe({ product_ids: ['LTC-USD'], channels: ['ticker', 'user'] })
        
    }
    render = () => {
        return(
            <div> This is the table that will hold prices </div>
        )
    }
}

export default Table;