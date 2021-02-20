import React, { Component } from 'react';
import Web3 from 'web3';
import 'react-bootstrap-buttons/dist/react-bootstrap-buttons.css';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
require('dotenv').config()
const address=process.env.REACT_APP_KEY;

class App extends Component {

  constructor(props) {
    super(props)
    this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8546")
    this.contract = new this.web3.eth.Contract(
     [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}],
      address
    )

    this.state = {  myAccountAddress: "my contract address",
                    myAccountBalance: 0,
                    tokenSymbol: "???",
                    decimals: 0,
                    numberOfTokensToSend: 0,
                    addressTo: '',
                    msg: ''
                }
    
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.web3.eth.getAccounts().then( accounts => {
      if (accounts[0]) {
        this.setState({ myAccountAddress: accounts[0]})
        this.contract.methods.balanceOf(accounts[0]).call().then( balance => {
          this.contract.methods.decimals().call().then( decimals => {
            this.contract.methods.symbol().call().then( tokenSymbol => {
              this.setState({
                tokenSymbol: tokenSymbol,
                decimals: decimals,
                myAccountBalance: balance / (Math.pow(10, decimals))
              })
            })
          })
        })

      } else {
        this.setState({ myAccountAddress: "undefined. Log in to Metamask please!"})
      }
    })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
     this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
   

    const addressTo = this.state.addressTo
    const decimals = this.state.decimals
    const numberOfTokensToSend = this.state.numberOfTokensToSend * Math.pow(10, decimals)
    const myAccount = this.state.myAccountAddress
    console.log("numberOfTokensToSend = " + numberOfTokensToSend)
    console.log("addressTo = " + addressTo)

    this.contract.methods.transfer(addressTo, numberOfTokensToSend).send({from: myAccount})
      .on('transactionHash', function(hash) {
        this.setState({msg: "You will be able to find your trxn here https://ropsten.etherscan.io/tx/" + hash})
      }.bind(this))
      .on('error', function(error) {
        this.setState({msg: "Error occured: " + error})
      }.bind(this))
  }

  render() { 
   return (
    
      
    
    <div className="whole" >
      {/* <Helmet>
      <style>{'body { background-image: -webkit-linear-gradient(60deg, #e91e63 50%, #f8bbd0 50%);}'}</style>
      <style>{'body { background-color: #e4e9fd;}'}</style>
      <style>{'body { min-height: 650px;}'}</style>
            </Helmet>
             */}
           
      <style>{'body { background-color: #eee6ff;}'}</style>
      <div  className="address">You address is <h6 class="h6">{this.state.myAccountAddress}</h6> </div>
     
      <div className="balance">You have <b>{this.state.myAccountBalance} {this.state.tokenSymbol}</b> tokens</div>
      <form onSubmit={this.handleSubmit} className="form-signin">
        <div class="form-group row">
          <h6 class="h6"className="label">Tokens to send</h6>
        <input
            type="number"
            name="numberOfTokensToSend"
            placeholder="Tokens to send"
            className="form-control top"
            value={this.state.numberOfTokensToSend}
            onChange={this.handleInputChange}
            required
          /> 
          
        <br />
        <h6 class="h6" className="label">To</h6>
         <input
            type="text"
            name="addressTo"
            className="form-control bottom"
            placeholder="Address to send"
            value={this.state.addressTo}
            onChange={this.handleInputChange}
            required
          />
        <button  class="btn btn-md btn-primary btn-block"  type="submit" value="Submit">
       Submit
      </button>
      <div className="msg"><h6 class="h6">Message:{this.state.msg}</h6></div>
       </div>
      </form>
     
      </div>
      
   
   );
  }
}

export default App;
