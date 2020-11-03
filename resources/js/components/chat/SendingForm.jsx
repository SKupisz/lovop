import React from "react";
import ReactDOM from "react-dom";

export default class SendingForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            buttonContent: "💖"
        }
    }
    render(){
        return(
            <div className="chat-form">
                <input type="text" name="text" id="" placeholder="Napisz coś..." className="chat-form-input"/>
                <button type = "button" className="chat-form-submit">{this.state.buttonContent}</button>
            </div>
        );
    }
}

if(document.getElementById("chat-form-wrapper")){
    ReactDOM.render(<SendingForm/>,document.getElementById("chat-form-wrapper"));
}