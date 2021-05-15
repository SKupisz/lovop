import React from "react";

export default class GrahpicsSubSection extends React.Component{
    constructor(props){
        super(props);
        this.changeBackground = this.changeBackground.bind(this);
        this.takeTheShot = this.takeTheShot.bind(this);
        this.colorsList = ["red","green","blue","white","gray","purple","cyan","magenta"]
    }
    async takeTheShot(route, params){
        const databack = await fetch(route,params)
        .then(back => back.json())
        .then( (data) => {} );
    }
    changeBackground(route,mode,course){
        const params = this.props.createTheData({
            newbackground: mode,
            whatToUpdate: course
        });
        this.takeTheShot(route,params).then(() => {this.props.clickCallback()});
    }
    render(){
        return(
          <div className="">
              {this.colorsList.map(item => <div className={"color-div "+item} onClick = {() => {this.changeBackground(this.props.changeRoute, item, this.props.whatToChange)}}></div>)}
                <div className="color-reset" onClick = {() => {this.changeBackground(this.props.changeRoute, "default", this.props.whatToChange)}}>Ustawienia fabryczne</div>
          </div>  
        );
    }
}