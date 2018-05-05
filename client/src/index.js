import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './main.css'
import Login from './login'
import Search from './search'
import Results from './results'
class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            term:'',
            data:[]
        }
    this.onInputChange = this.onInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    }
    onInputChange(e){
        this.setState({term: e.target.value})
    }
    handleSubmit(e){
        e.preventDefault()
        axios.get(`https://nightlife-v2-ehutc00f.c9users.io:8081/api/search/${this.state.term}`)
        .then(res => {
            this.setState({ data: res.data })
        })
        this.setState({term:""})
    }
    render(){
        // console.log(this.state.data)
        const data = this.state.data;
        const render = data.map(x => {
          const result =  <Results key={x.id} id={x.id} name={x.name} img={x.img} url={x.url} rating={x.rating} phone={x.phone} location={x.location.display_address} rsvp={x.rsvp}/>
          return result
        // console.log(x)
        })
        return(
            <div>
                <Login />
                <Search editTerm={this.onInputChange} handleSubmit={this.handleSubmit}/>
                {render}
            </div>
        )
    }
}


ReactDOM.render(<App />, document.querySelector('.root'));