import React, {Component} from 'react';


class Login extends Component{
    constructor(props){
        super(props)
    }
    render(){

        return(
        <div className="nav">
            <form> 
                <button className="btn btn-primary" href="https://nightlife-v2-ehutc00f.c9users.io/auth/twitter">Log In</button>
            </form>
        </div>
        )
    }
}


export default Login