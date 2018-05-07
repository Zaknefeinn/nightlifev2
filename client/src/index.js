import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './main.css'
import Login from './login'
import Search from './search'
import Results from './results'
import { Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            term:'',
            data:[],
            userID:'',
            userName:'',
            loggedIn:false,
            searchHistory:''
        }
    this.onInputChange = this.onInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    componentDidMount(){
        this.getUser();
        const history = localStorage.getItem('prevSearch');
        if(history !== null && history !== 'empty'){
            this.setState({term:JSON.parse(history)})
            axios.get(`https://glacial-eyrie-64416.herokuapp.com/api/search/${JSON.parse(history)}`)
            .then(res => {
            this.setState({ data: res.data })
            localStorage.setItem('prevSearch', 'empty')
            this.setState({term:""})
        })
        }
    }
    onInputChange(e){
        this.setState({term: e.target.value})
    }
    handleSubmit(e){
        e.preventDefault()
        if(this.state.term !== this.state.searchHistory && this.state.term !== ''){
        axios.get(`https://glacial-eyrie-64416.herokuapp.com/api/search/${this.state.term}`)
        .then(res => {
            this.setState({ data: res.data })
        })
        localStorage.setItem('prevSearch', 'empty')
        this.setState({searchHistory:this.state.term})
        this.setState({term:""})
        }
    }
    
    getUser(){
       axios.get(`https://glacial-eyrie-64416.herokuapp.com/api/get_user`, {withCredentials: true})
       .then(res => {
          if(res.data !== ''){
              this.setState({userID:res.data.twitterID})
              this.setState({userName:res.data.name})
              this.setState({loggedIn:true})
          }
        })
    }
    render(){
        const options = {
          timeout: 5000,
          position: "top center"
        };
        const data = this.state.data;
        console.log(data)
        const render = data.map(x => {
          const result =  <Results loggedIn={this.state.loggedIn} userName={this.state.userName} userID={this.state.userID} key={x.id} id={x.id} name={x.name} img={x.img} url={x.url} rating={x.rating} phone={x.phone} location={x.location.display_address} rsvp={x.rsvp}/>
          return result
        // console.log(x)
        })
        return(
            <div>
                <Provider template={AlertTemplate} {...options}>
                <div className='showUsers' id="showUsers">
                </div>
                    <h1 className="description">~FCC Nite Lyfe~</h1>
                    <h2 className="description">Search a location to see who's going!</h2>
                    <Login searchHistory={this.state.searchHistory} loggedIn={this.state.loggedIn} userName={this.state.userName}/>
                    <Search editTerm={this.onInputChange} term={this.state.term} handleSubmit={this.handleSubmit}/>
                    {render}
                </Provider>
            </div>
        )
    }
}


ReactDOM.render(<App />, document.querySelector('.root'));