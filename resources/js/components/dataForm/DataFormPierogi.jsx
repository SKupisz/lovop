import React from "react";
import ReactDOM from "react-dom";

export default class DataFormPierogi extends React.Component{
    constructor(props){
        super(props);
        this.pierogiRef1 = React.createRef();
        this.pierogiRef2 = React.createRef();
        this.pierogiRef3 = React.createRef();
        this.pierogiRef4 = React.createRef();
        this.pierogiRef5 = React.createRef();
        this.pierogiRef6 = React.createRef();
        this.pierogiRefs = [
            [this.pierogiRef1, "Z mięsem"], 
            [this.pierogiRef2, "Ruskie"],
            [this.pierogiRef3, "Z kapustą i grzybami"], 
            [this.pierogiRef4, "Z serem"],
            [this.pierogiRef5, "Z jagodami"], 
            [this.pierogiRef6, "Ze szpinakiem"]
        ];
        this.extendedPierogi = React.createRef();

        this.tableOfOrders = [0,0,0,0,0,0];
        this.state = {
            code: 0
        };
        this.addToQueue = this.addToQueue.bind(this);
    }
    addToQueue(number,numberRef){
        if(this.tableOfOrders[number] == 0){
            this.tableOfOrders[number] = 1;
            numberRef.current.classList.add("chosen");
        }
        else{
            this.tableOfOrders[number] = 0;
            numberRef.current.classList.remove("chosen");
        }
        let newCode = 0;
        for(let i = 5; i >=0 ; i--){
            newCode+=this.tableOfOrders[i]*Math.pow(2,Math.abs(i-5));
        }
        this.setState({
            code: newCode
        },() => {});
    }
    componentDidMount(){
        if(this.props.currentcode){
            let codeOperand = Number(this.props.currentcode);
            if(codeOperand !== null){
                this.setState({
                    code: codeOperand
                },() => {
                    codeOperand = codeOperand.toString(2).split("").reverse().join("");
                    for(let i = 5; i >= (5-codeOperand.length); i--){
                        this.tableOfOrders[i] = Number(codeOperand.charAt(5-i));
                        if(this.tableOfOrders[i] == 1){
                            this.pierogiRefs[i][0].current.classList.add("chosen");
                        }
                        
                    }
                });
            }
        }
        if(this.props.currentpersonal){
            this.extendedPierogi.current.value = this.props.currentpersonal;
        }
    }
    render(){
        return(
            <div className="pierogi-wrapper">
                <div className="pierogi-buttons">
                    {this.pierogiRefs.map((item,index) => <button type="button" className="pierogi-classic-btn" ref={item[0]} onClick={()=>{this.addToQueue(index,item[0])}}>{item[1]}</button>)}
                </div>
                <input type="text" name="pierogiExtended" id="" ref = {this.extendedPierogi} placeholder="Inne (opcjonalnie)" className="data-formInput"/>

                <input type="number" name="pierogiStandard" id="" className = "pierogiStandard" value = {this.state.code}/>
            </div>
        )
    }
}

if(document.getElementById("pierogi-answers")){
    const props = Object.assign({},document.getElementById("pierogi-answers").dataset);

    ReactDOM.render(<DataFormPierogi {...props}/>,document.getElementById("pierogi-answers"));
}