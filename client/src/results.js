import React, {Component} from 'react';


class Results extends Component{
    constructor(props){
        super(props)
    }
    

    render(){
        return(
            <div className="results-container">
                <ul>
                    <li>
                        <img src="https://wp-test.sencha.com/wp-content/uploads/2016/02/icon-sencha-test-studio-1.png" alt="nothing"/>
                        <div className="info">
                            <p>Restraunt</p>
                            <p>Going?</p>
                            <p>"I ate here last night with my husband for our anniversary. After living here for over 3 1/2 years, I finally came here! I actually have been to the..."</p>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Results