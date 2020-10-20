import React from "react";
import ReactDOM from "react-dom";

export default class DataFormCheckboxes extends React.Component{
    constructor(props){
        super(props);
        this.woman = React.createRef();
        this.man = React.createRef();
        this.checkedWoman = false;
        this.checkedMan = false;
        //console.log(props);

        this.pickedUpUsersSex = this.pickedUpUsersSex.bind(this);
    }
    pickedUpUsersSex(name){
        if(name == "woman"){
            if(this.checkedWoman == false){
                this.checkedWoman = true;
                this.checkedMan = false;
                this.man.current.checked = false;
            }
            else{
                this.checkedWoman = false;
            }
        }
        else{
            if(this.checkedMan == false){
                this.checkedMan = true;
                this.checkedWoman = false;
                this.woman.current.checked = false;
            }
            else{
                this.checkedMan = false;
            }
        }
    }
    componentDidMount(){
        if(this.props.currentsex){
            if(this.props.currentsex === "1"){ // woman
                this.checkedWoman = true;
                this.woman.current.checked = true;
            }
            else if(this.props.currentsex === "2"){ // man
                this.checkedMan = true;
                this.man.current.checked = true;
            }
        }
    }
    render(){
        return(
            <div className="content">
                <label for="" class="sex-label">K</label><input type="checkbox" name="woman" ref = {this.woman} onClick = {() => {this.pickedUpUsersSex("woman")}} id="woman-checkbox" class="data-formCheckInput"/>
                <label for="" class="sex-label">M</label><input type="checkbox" name="man" ref = {this.man} onClick = {() => {this.pickedUpUsersSex("man")}} id="" class="data-formCheckInput"/>
            </div>
        );
    }
}

if(document.getElementById("sex-answers")){
    const props = Object.assign({},document.getElementById("sex-answers").dataset);
    ReactDOM.render(<DataFormCheckboxes {...props}/>,document.getElementById("sex-answers"));
}
