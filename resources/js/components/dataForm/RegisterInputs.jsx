import React from "react";
import ReactDOM from "react-dom";

export default class RegisterInputs extends React.Component{
    constructor(props){
        super(props);
        this.oldPassRef = React.createRef();
        this.firstPassRef = React.createRef();
        this.repPassRef = React.createRef();
        this.resetContent = this.resetContent.bind(this);
        this.reactOnChange = this.reactOnChange.bind(this);
    }
    resetContent(ref){
        ref.current.value = "";
    }
    reactOnChange(ref,mode){
        if(ref.current.value.length == 0){
            ref.current.classList.remove("input-red");
            ref.current.classList.remove("input-green");
        }
        else if(ref.current.value.length < 8){
            ref.current.classList.add("input-red");
            ref.current.classList.remove("input-green");
        }
        else{
            ref.current.classList.remove("input-red");
            ref.current.classList.add("input-green");
        }
        if(mode == 2 && ref.current.value.length>=8){
            if(ref.current.value != this.firstPassRef.current.value){
                ref.current.classList.add("input-red");
                ref.current.classList.remove("input-green");
            }
            else{
                ref.current.classList.remove("input-red");
                ref.current.classList.add("input-green");
            }
        }
    }
    componentDidMount(){
        if(typeof this.props.firstpasswd != 'undefined'){
            this.firstPassRef.current.value = this.props.firstpasswd;
            this.reactOnChange(this.firstPassRef,1);
        }
        if(typeof this.props.secondpasswd != 'undefined'){
            this.repPassRef.current.value = this.props.secondpasswd;
            this.reactOnChange(this.repPassRef,2);
        }
        if(typeof this.props.oldpasswd != "undefined"){
            this.oldPassRef.current.value = this.props.oldpasswd;
            this.reactOnChange(this.oldPassRef,3);
        }
    }
    render(){
        if(typeof this.props.ifsignin != "undefined"){
            return(
                <div className="container-of-inputs">
                    <div className="input-container">
                        <input type="password" name="user-passwd" ref = {this.firstPassRef} onChange={() => {this.reactOnChange(this.firstPassRef,1);}} id="signin-passwd-input" placeholder="Hasło" className="register-input" required/>
                        <button type="button" className="register-reset-btn" onClick={() => {this.resetContent(this.firstPassRef)}}>↺</button>
                    </div>
                </div>
            );
        }
        else if(typeof this.props.ifreset != "undefined"){
            return(
                <div className="container-of-inputs">
                <div className="input-container">
                    <input type="password" name="old-passwd" ref = {this.oldPassRef} onChange={() => {this.reactOnChange(this.oldPassRef,3);}} id="signin-passwd-input" placeholder="Stare hasło" className="register-input"/>
                    <button type="button" className="register-reset-btn" onClick={() => {this.resetContent(this.oldPassRef)}}>↺</button>
                </div>
                <div className="input-container">
                    <input type="password" name="new-passwd" ref = {this.firstPassRef} onChange={() => {this.reactOnChange(this.firstPassRef,1);}} id="signin-passwd-input" placeholder="Nowe hasło" className="register-input"/>
                    <button type="button" className="register-reset-btn" onClick={() => {this.resetContent(this.firstPassRef)}}>↺</button>
                </div>
                <div className="input-container">
                    <input type="password" name="new-passwd-rep" ref = {this.repPassRef} onChange={() => {this.reactOnChange(this.repPassRef,2);}} id="signin-passwdrep-input" placeholder="Powtórz hasło" className="register-input"/>
                    <button type="button" className="register-reset-btn" onClick={() => {this.resetContent(this.repPassRef)}}>↺</button>
                </div>
            </div>
            );
        }
        else{
            return(
                <div className="container-of-inputs">
                    <div className="input-container">
                        <input type="password" name="new-passwd" ref = {this.firstPassRef} onChange={() => {this.reactOnChange(this.firstPassRef,1);}} id="signin-passwd-input" placeholder="Hasło" className="register-input" required/>
                        <button type="button" className="register-reset-btn" onClick={() => {this.resetContent(this.firstPassRef)}}>↺</button>
                    </div>
                    <div className="input-container">
                        <input type="password" name="new-passwd-rep" ref = {this.repPassRef} onChange={() => {this.reactOnChange(this.repPassRef,2);}} id="signin-passwdrep-input" placeholder="Powtórz hasło" className="register-input" required/>
                        <button type="button" className="register-reset-btn" onClick={() => {this.resetContent(this.repPassRef)}}>↺</button>
                    </div>
                </div>
            );
        }
    }
}

if(document.getElementById("passwords-container")){
    const props = Object.assign({},document.getElementById("passwords-container").dataset);
    ReactDOM.render(<RegisterInputs {...props}/>,document.getElementById("passwords-container"));
}