import React, {Component} from 'react';
import axios from 'axios';

class Results extends Component{
    constructor(props){
        super(props)
        this.state = {
            stars:[],
            rsvp:'going',
            going: 0
        }
        this.rsvp = this.rsvp.bind(this)
    }
    componentDidMount(){
        this.showStars()
        const database = this.props.rsvp
        if(database.user !== undefined){
            this.setState({going:this.props.rsvp.user.length})
           const user =  database.user.filter(x => x === 'user3')
           if(user.length > 0){
               this.setState({rsvp:'rsvp'})
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
    const data = {
        'id':this.props.id,
        'user':'user3',
        'bar':this.props.name
    }
    const state = this.state.rsvp
    if(state === 'going'){
        this.setState({rsvp:'rsvp'})
    } else {
        this.setState({rsvp:'going'})
    }
    axios('https://nightlife-v2-ehutc00f.c9users.io:8081/test', {
        method:'post',
        data:data
    }).then(res => {console.log(res)})
}
    render(){
    const classes = this.state.rsvp;
    const stars = this.state.stars
    const renderStar = stars.map((x, index) => {
        return (
        <span key={index}className={x}></span>    
        )
    })
        return(
            <div className="results-container">
                <ul>
                    <li>
                        <img src={this.props.img} alt="nothing"/>
                        <div className="info">
                            <h3><a href={this.props.url}>{this.props.name}</a></h3>
                            <p>Going? {this.state.going} currently going!</p>
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

export default Results