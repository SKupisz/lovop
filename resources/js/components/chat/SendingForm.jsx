import React from "react";
import ReactDOM from "react-dom";

export default class SendingForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            buttonContent: "💖"
        }
        this.inputRef = React.createRef();
        this.changeButtonContent = this.changeButtonContent.bind(this);
        this.sendTheMessage = this.sendTheMessage.bind(this);
        this.takeTheShot = this.takeTheShot.bind(this);
    }
    async takeTheShot(params){
        const databack = await fetch("/user/chat/sendTheMessage",params)
        .then(back => back.json())
        .then(
            (data) => {
                console.log(JSON.stringify(data));
        });
    }
    changeButtonContent(){
        let newContent = "";
        if(this.inputRef.current.value.length == 0){
            newContent = "💖";
        }
        else{
            newContent = "💨";
        }
        this.setState({
            buttonContent : newContent
        },() => {});
    }
    sendTheMessage(){
        let messageContent = "";
        if(this.inputRef.current.value.length == 0){
            messageContent = this.state.buttonContent;
        }
        else{
            messageContent = this.inputRef.current.value;
        }
        const messageParams = {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                content: messageContent,
                emailToWriteWith: this.props.email,
                 _token: this.props.sendingtoken
            })
        };
        this.inputRef.current.value = "";
        this.changeButtonContent();
        this.takeTheShot(messageParams);
    }
    render(){
        return(
            <div className="chat-form">
                <input type="text" name="text" ref = {this.inputRef} id="" placeholder="Napisz coś..." className="chat-form-input" onChange={() => this.changeButtonContent()}/>
                <button type = "button" className="chat-form-submit" onClick = {() => {this.sendTheMessage()}}>{this.state.buttonContent}</button>
            </div>
        );
    }
}

if(document.getElementById("chat-form-wrapper")){
    const props = Object.assign({},document.getElementById("chat-form-wrapper").dataset);
    ReactDOM.render(<SendingForm {...props} />,document.getElementById("chat-form-wrapper"));
}