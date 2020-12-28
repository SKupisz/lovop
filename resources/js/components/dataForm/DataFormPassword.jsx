import { type } from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import RegisterInputs from "./RegisterInputs.jsx";


export default class NewPassword extends React.Component{
    constructor(props){
        super(props);
        this.launchButtonRef = React.createRef();
        this.containerRef = React.createRef();

        this.openTheChangingForm = this.openTheChangingForm.bind(this);
    }
    openTheChangingForm(){
        if(this.containerRef.current.classList.contains("hidden"))
            this.containerRef.current.classList.remove('hidden');
        else this.containerRef.current.classList.add('hidden');
    }
    render(){
        if(typeof this.props.oldpasswd != "undefined" && typeof this.props.firstpasswd != "undefined" && typeof this.props.secondpasswd != "undefined"){
            return(
                <div>
                    <button ref = {this.launchButtonRef} type="button" className="openPasswdChange" onClick = {() => {this.openTheChangingForm()}}>Zmień hasło</button>
                    <div className="passwds-container hidden" ref = {this.containerRef}>
                        <RegisterInputs ifreset="true" oldpasswd = {this.props.oldpasswd} firstpasswd = {this.props.firstpasswd} secondpasswd = {this.props.secondpasswd} />
                    </div>
                </div>
            );
        }
        else{
            return(
                <div>
                    <button ref = {this.launchButtonRef} type="button" className="openPasswdChange" onClick = {() => {this.openTheChangingForm()}}>Zmień hasło</button>
                    <div className="passwds-container hidden" ref = {this.containerRef}>
                        <RegisterInputs ifreset="true"/>
                    </div>
                </div>
            );
        }
    }
}

if(document.getElementById("user-password-change")){
    const props = Object.assign({},document.getElementById("user-password-change").dataset);
    ReactDOM.render(<NewPassword {...props}/>,document.getElementById("user-password-change"));
}