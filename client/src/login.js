import React, {Component} from 'react';

class Login extends Component{

    displayButton(){
        if(!this.props.loggedIn){
            return <a className="btn btn-primary" onClick={()=>localStorage.setItem('prevSearch', JSON.stringify(this.props.searchHistory))}href="https://glacial-eyrie-64416.herokuapp.com:8081/auth/twitter">Log In</a>  
        } else {
            return <a className="btn btn-primary" onClick={()=>localStorage.setItem('prevSearch', 'empty')}href="https://glacial-eyrie-64416.herokuapp.com:8081/api/logout">Log Out</a>
        }
    }
    render(){
        return(
        <div className="nav">
            <div> 
                {this.displayButton()}
            </div>
        </div>
        )
    }
}


export default Login;

// <button onClick = {async (e) => {
//     const res = await axios.get('https://nightlife-v2-ehutc00f.c9users.io:8081/api/get_user', {withCredentials: true});
//     // console.log(res.data);
// }}>Get User</button>