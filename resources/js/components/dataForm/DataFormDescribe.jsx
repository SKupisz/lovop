import React from "react";
import ReactDOM from "react-dom";

export default class DataFormDescribe extends React.Component{
    constructor(props){
        super(props);
        let currDesc = "", currLen = 0;
        if(this.props.currentdesc){
            currDesc = this.props.currentdesc;
            currLen = this.props.currentdesc.length;
        }
        this.state = {
            currentDescribe: currDesc,
            currentLen: currLen,
            maxLength: 100
        };
        this.changeText = this.changeText.bind(this);
        this.textRef = React.createRef();
    }
    changeText(newText){
        if(newText.length <= this.state.maxLength){
            this.setState({
                currentDescribe: newText,
                currentLen: newText.length
            },() => {});
        }
        else{
            this.textRef.current.value = this.state.currentDescribe;
        }
    }
    render(){
        return(
            <section>
                <textarea name="userDesc" ref = {this.textRef} className="data-formInput data-formTextarea" onChange={(event) => {this.changeText(event.target.value)}}>
                    {this.state.currentDescribe}
                </textarea>
                <div className="counter-wrapper"><label htmlFor="" className="counter-number" style ={{color: "rgba("+255*this.state.currentLen/this.state.maxLength+","+255*(this.state.maxLength - this.state.currentLen)/this.state.maxLength+",0,1)"}}>{this.state.currentLen}</label>/<label htmlFor="">{this.state.maxLength}</label></div>
            </section>
        )
    }
}
if(document.getElementById("user-describe")){
    const props = Object.assign({},document.getElementById("user-describe").dataset);
    
    ReactDOM.render(<DataFormDescribe {...props}/>,document.getElementById("user-describe"));
}