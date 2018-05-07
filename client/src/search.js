import React, {Component} from 'react';


class Search extends Component{
    constructor(props){
        super(props)
    }
    
    render(){
        
        return(
            <div className="search-container">
                <form onSubmit={this.props.handleSubmit}>
                    <input className="form-control" onChange={this.props.editTerm} value={this.props.term} placeholder="City Name"/>
                    <button className="btn btn-outline-secondary" type="submit">Go</button>
                </form>
            </div>
        )
    }
}

export default Search


// <div class="input-group mb-3">
//   <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">
//   <div class="input-group-append">
//     <button class="btn btn-outline-secondary" type="button">Button</button>
//   </div>
// </div>