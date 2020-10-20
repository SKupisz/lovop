import React from "react";
import ReactDOM from "react-dom";

export default class UserPicker extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            pierogiList: null,
            pierogiNew: null,
            name: null,
            surname: null,
            pierogiRepresentative: null,
            loversData: null,
            loversIterator: 0,
            isMounted: false,
            isLoaded: false

        };

        this.convertIntoPierogiList = this.convertIntoPierogiList.bind(this);
        this.prepareForeignPierogiStaff = this.prepareForeignPierogiStaff.bind(this);
        this.throwThisOut = this.throwThisOut.bind(this);

        fetch("/user/support/randSomeNewLover")
        .then(res => res.json())
        .then(result => {
            this.setState({
                loversData: result,
                loversIterator: 0,
                isLoaded: true
            },() => {
                this.convertIntoPierogiList(this.state.loversData[this.state.loversIterator]["pierogiBasic"]);
            });
        });
    }
    convertIntoPierogiList(pierogiClassic){
        if(Number(pierogiClassic) >=64){
            this.setState({
                pierogiList: ["Coś poszło nie tak. Spróbuj później"]
            },() => {});
        }
        else{
            const tableOfClassic = ["Z mięsem","Ruskie","Z kapustą i grzybami","Z serem","Z jagodami","Ze szpinakiem"];
            pierogiClassic = Number(pierogiClassic).toString(2).split("").reverse().join("");
            let finalList = [], tableIndex = tableOfClassic.length-1;
            for(let i = 0 ; i < pierogiClassic.length; i++){
                if(pierogiClassic[i] === "1"){
                    finalList.push(tableOfClassic[tableIndex]);
                }
                tableIndex--;
            }
            this.setState({
                pierogiList: finalList
            },() => {
                let putTheClassicListOnDisplay = this.state.pierogiList.map((pierog,index) => {
                    if(pierog == "Coś poszło nie tak. Spróbuj później"){
                        return <div className="fav-pierogi-elem error-elem">{pierog}</div>;
                    }
                    else{
                        if(index % 3 == 2){
                            return <div className="fav-pierogi-elem wider-elem">{pierog}</div>;
                        }
                        else{
                            return <div className="fav-pierogi-elem">{pierog}</div>;
                        }   
                    }});
                this.setState({
                    pierogiRepresentative: putTheClassicListOnDisplay
                },() => {});
            });
        }        
    }
    prepareForeignPierogiStaff(pierogiExtended){
        if(pierogiExtended !== ""){
            return <div className="fav-pierogi-extended">{pierogiExtended}</div>;
        }
        else{
            return null;
        }
    }
    throwThisOut(){
        if(this.state.loversIterator == this.state.loversData.length-1){
            
        }
        else{
            this.setState({
                loversIterator: this.state.loversIterator+1
            },() => {
    
            });
        }
    }
    componentDidMount(){
        this.setState({
            isMounted: true
        },() => {console.log("mounted")});
    }
    render(){
        if(this.state.isMounted == false || this.state.isLoaded == false){
            return(<section className="user-picker-container">
            <div className="loading-div">Loading
            <label htmlFor="" className="loading-div-dots dot-1">.</label>
            <label htmlFor="" className="loading-div-dots dot-2">.</label>
            <label htmlFor="" className="loading-div-dots dot-3">.</label></div>
        </section>);
        }
        else if(typeof(this.state.loversData) === "object" && this.state.loversData !==null){
            return(<section className="user-picker-container">
            <div className="photo-section" style={{
                background: 'gray url("/user/profilePicture/'+this.state.loversData[this.state.loversIterator]["email"]+'")'
            }}>
                <div className="decision-panel">
                    <button className="panel-btn accept-btn">💘</button>
                    <button className="panel-btn deny-btn" onClick = {()=>{this.throwThisOut()}}>❌</button>
                </div>
            </div>
            <div className="info-section">
                <header className="name-and-age">
                    {this.state.loversData === null ? "": this.state.loversData[this.state.loversIterator]["username"]+","+this.state.loversData[this.state.loversIterator]["age"]}
                </header>
                <div className="pierogi-section">
                    {this.state.pierogiRepresentative}
                    {this.state.pierogiList === null ? "" : this.prepareForeignPierogiStaff(this.state.loversData[this.state.loversIterator]["pierogiExtended"])}
                </div>
            </div>
        </section>);
        }
        else{
            return(<section className="user-picker-container">
            <div className="photo-section" style={{
                background: "red"
            }}>
            </div>
            <div className="info-section">
                <header className="name-and-age">
                    <div className="">Coś poszło nie tak...</div>
                    <div className="">Spróbuj później</div>
                </header>
            </div>
        </section>);
        }
    }
}

if(document.getElementById("user-picker-wrapper")){
    const props = Object.assign({},document.getElementById("user-picker-wrapper").dataset);
    ReactDOM.render(<UserPicker {...props}/>,document.getElementById("user-picker-wrapper"));
}