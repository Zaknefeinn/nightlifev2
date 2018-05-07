import React, {Component} from 'react';
import axios from 'axios';
import { withAlert } from "react-alert";

class Results extends Component{
    constructor(props){
        super(props)
        this.state = {
            stars:[],
            rsvp:'going',
            going: 0,
            clicked:false
        }
        this.rsvp = this.rsvp.bind(this)
    }
componentDidMount(){
    this.showStars()
    this.populateGoing()
}

componentDidUpdate(prevProps, prevState){
    if(prevState.rsvp !== this.state.rsvp && this.state.clicked){
    if((prevState.rsvp === 'going')){
            this.setState({going:this.state.going + 1})
        }else {
            this.setState({going:this.state.going - 1})
        }
    }
}

populateGoing(){
    if(this.props.loggedIn){
        const database = this.props.rsvp
        if(database.user !== undefined){
            this.setState({going:this.props.rsvp.user.length})
           const user =  database.user.filter(x => x === this.props.userID)
           if(user.length > 0){
               this.setState({rsvp:'rsvp'})
           } else {
               this.setState({rsvp:'going'})
           }
        } 
    }
}
showStars(){
    let stars = this.props.rating;
    let rating = []
    for(let i=0; i <5; i++){
        if(stars > 1){
            rating.push('star on')
            stars = stars -1
        } else if (stars > 0){
            rating.push('star half')
            stars = stars -1
        } else {
            rating.push('star')
        }
    }
    this.setState({stars: rating})
}
rsvp(e){
    if(this.props.loggedIn){
        this.setState({clicked:true})
        const data = {
            'id':this.props.id,
            'user':this.props.userID,
            'userName':this.props.userName,
            'bar':this.props.name
        }
        const state = this.state.rsvp
        if(state === 'going' || state === ''){
            this.setState({rsvp:'rsvp'})
        } else {
            this.setState({rsvp:'going'})
        }
        axios('https://nightlife-v2-ehutc00f.c9users.io:8081/test', {
            method:'post',
            data:data,
            withCredentials: true
        }).then(res => {console.log(res)})
    } else {
        this.props.alert.show('You must be logged in!')
    }
}

handleClass(){
    if(this.state.rsvp === ''){
        return 'going'
    } else{
        return this.state.rsvp
    }
}
handlePopUp(e){
    const userNames = this.props.rsvp.userNames;
    const toolTip = document.getElementById('showUsers')
    const x = e.clientX,
        y = e.clientY;
    if(userNames !== undefined){
        toolTip.innerHTML = 
        (`<ul>
        ${userNames.map(x => {
        return (`<li class="userList">${x}</li>`)}
        ).join(' ')}
        </ul>`)
    } else {
        toolTip.innerHTML = ``
    }
        
    toolTip.style.top = y + 'px';
    toolTip.style.left = x + 'px';
    toolTip.style.display ="block"
}
hidePopUp(){
    const toolTip = document.getElementById('showUsers')
    toolTip.style.display ="none"
}
    render(){
        // console.log(this.props.rsvp)
    const classes = this.state.rsvp
    const stars = this.state.stars
    const renderStar = stars.map((x, index) => {
        return (
        <span key={index}className={x}></span>    
        )
    })
        return(
            <div className="results-container">
                <ul>
                    <li className="results-list">
                        <img src={this.props.img} alt="nothing"/>
                        <div className="info">
                            <h3><a href={this.props.url}>{this.props.name}</a></h3>
                            <p className="currentGoing" onMouseOver={(e)=> this.handlePopUp(e)} onMouseOut={()=>this.hidePopUp()}>Going? {this.state.going} currently going!</p>
                                <button className={classes} onClick={this.rsvp}></button>
                        </div>
                        <div className="address">
                        <p>{this.props.location[0]}</p>
                        <p>{this.props.location[1]}</p>
                        </div>
                        <div className="rating">
                        <p>{this.props.rating} Stars</p>
                        {renderStar}
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

export default withAlert(Results);