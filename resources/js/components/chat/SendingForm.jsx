import React, {useState,useEffect} from "react";
import ReactDOM from "react-dom";

export default class SendingForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            buttonContent: "💖",
            note: null,
            isListening: false
        }
        this.inputRef = React.createRef();
        this.changeButtonContent = this.changeButtonContent.bind(this);
        this.sendTheMessage = this.sendTheMessage.bind(this);
        this.takeTheShot = this.takeTheShot.bind(this);
        this.transcriptTheMessage = this.transcriptTheMessage.bind(this);

        this.speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.mic = new this.speechRecognition();
        this.mic.continuous = true;
        this.mic.interimResults = true;
        this.mic.lang = 'pl-PL';
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
    transcriptTheMessage(){
        console.log(this.state.isListening);
        if (this.state.isListening == true) {
            this.mic.start()
            this.mic.onend = () => {
              console.log('continue..')
              this.mic.start()
            }
          } else {
            this.mic.stop()
            this.mic.onend = () => {
              console.log('Stopped this.mic on Click')
            }
          }
          this.mic.onstart = () => {
            console.log('Mics on')
          }      
          this.mic.onresult = event => {
            let transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join(' ')
            console.log(transcript)
            this.inputRef.current.value = transcript;
            this.changeButtonContent();
            this.mic.onerror = event => {
              console.log(event.error)
            }
          }
    }
    render(){
        return(
            <div className="chat-form">
                <input type="text" name="text" ref = {this.inputRef} id="" placeholder="Napisz coś..." className="chat-form-input" onChange={() => this.changeButtonContent()}/>
                <button type = "button" className="chat-form-submit" onClick = {() => {this.sendTheMessage()}}>{this.state.buttonContent}</button>
                <button type = "button" className="chat-form-submit"
                 onMouseDown = {() => {this.setState({isListening: true},()=>{this.transcriptTheMessage();});}} onMouseUp = {() => {this.setState({isListening: false},()=>{this.transcriptTheMessage();});}}
                 onTouchStart = {() => {this.setState({isListening: true},()=>{this.transcriptTheMessage();});}} onTouchEnd = {() => {this.setState({isListening: false},()=>{this.transcriptTheMessage();});}}>🎤</button>
            </div>
        );
    }
}

/*if(document.getElementById("chat-form-wrapper")){
    const props = Object.assign({},document.getElementById("chat-form-wrapper").dataset);
    ReactDOM.render(<SendingForm {...props} />,document.getElementById("chat-form-wrapper"));
}*/