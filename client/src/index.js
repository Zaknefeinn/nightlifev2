import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './main.css'

import Search from './search'
import Results from './results'
class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            term:''
        }
    this.onInputChange = this.onInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    }
    onInputChange(e){
        this.setState({term: e.target.value})
        // console.log(e.target.value)
    }
    handleSubmit(e){
        e.preventDefault()
        // console.log(this.state.term)
        // axios('https://nightlife-v2-ehutc00f.c9users.io:8081/api/', {
        //         method: 'get',
        //         data: this.state.term,
        //         // withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json',
        //             // 'Access-Control-Allow-Origin' : 'https://nightlife-v2-ehutc00f.c9users.io:8081/'
        //         }
        //     })
        //     .then(res => {console.log(res)})
        //     .catch(err => console.log(err));
        axios.get('https://nightlife-v2-ehutc00f.c9users.io:8081/').then(res => {console.log(res)})
    }
    render(){
        const test = [1,2,3]
        const test1 = test.map(x => {
          const result =  <Results key={x}/>
          return result
        })
        return(
            <div>
                <Search editTerm={this.onInputChange} handleSubmit={this.handleSubmit}/>
                {test1}
            </div>
        )
    }
}


ReactDOM.render(<App />, document.querySelector('.root'));