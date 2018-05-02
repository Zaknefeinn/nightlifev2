import React, {Component} from 'react';


class Search extends Component{
    constructor(props){
        super(props)
    }
    
    render(){
        
        return(
            <div className="search-container">
                <form onSubmit={this.props.handleSubmit}>
                    <input onChange={this.props.editTerm} />
                    <button className="btn" type="submit">Go</button>
                </form>
            </div>
        )
    }
}

export default Search