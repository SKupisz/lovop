import React from "react";

export default class GrahpicsSubSection extends React.Component{
    constructor(props){
        super(props);
        this.changeBackground = this.changeBackground.bind(this);
        this.takeTheShot = this.takeTheShot.bind(this);
    }
    async takeTheShot(route, params){
        const databack = await fetch(route,params)
        .then(back => back.json())
        .then( (data) => {
            
        } );
    }
    changeBackground(route,mode,course){
        const params = {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                newbackground: mode,
                whatToUpdate: course,
                _token: this.props.sendingtoken
            })
        };
        this.takeTheShot(route,params).then(() => {this.props.clickCallback()});
    }
    render(){
        return(
          <div className="">
              <div className="color-div red" onClick = {() => {this.changeBackground(this.props.changeRoute, "red", "back")}}></div>
                <div className="color-div green" onClick = {() => {this.changeBackground(this.props.changeRoute, "green", "back")}}></div>
                <div className="color-div blue" onClick = {() => {this.changeBackground(this.props.changeRoute, "blue", "back")}}></div>
                <div className="color-div white" onClick = {() => {this.changeBackground(this.props.changeRoute, "white", "back")}}></div>
                <div className="color-div gray" onClick = {() => {this.changeBackground(this.props.changeRoute, "gray", "back")}}></div>
                <div className="color-div purple" onClick = {() => {this.changeBackground(this.props.changeRoute, "purple", "back")}}></div>
                <div className="color-div cyan" onClick = {() => {this.changeBackground(this.props.changeRoute, "cyan", "back")}}></div>
                <div className="color-div magenta" onClick = {() => {this.changeBackground(this.props.changeRoute, "magenta", "back")}}></div>
                <div className="color-reset" onClick = {() => {this.changeBackground(this.props.changeRoute, "default", "back")}}>Ustawienia fabryczne</div>
          </div>  
        );
    }
}