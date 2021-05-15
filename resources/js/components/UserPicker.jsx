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
            isLoaded: false,
            matchedName: "",
            matchedEmail: "",
            outOfUsers: false
        };

        this.convertIntoPierogiList = this.convertIntoPierogiList.bind(this);
        this.prepareForeignPierogiStaff = this.prepareForeignPierogiStaff.bind(this);
        this.throwThisOut = this.throwThisOut.bind(this);
        this.prepareLoveParams = this.prepareLoveParams.bind(this);
        this.afterCupidJob = this.afterCupidJob.bind(this);
        this.cupidDoingHisJob = this.cupidDoingHisJob.bind(this);
        this.makeTheMove = this.makeTheMove.bind(this);

        this.infoSectionRef = React.createRef();
        this.photoSectionRef = React.createRef();
        this.matchedSectionRef = React.createRef();

        fetch("/user/support/randSomeNewLover")
        .then(res => res.json())
        .then(result => {
            console.log(result.length);
            if(result.length == 0){
                this.setState({
                    isLoaded: true,
                    outOfUsers: true
                },() => {

                });
            }
            else{
                this.setState({
                    loversData: result,
                    loversIterator: 0,
                    isLoaded: true,
                    outOfUsers: false
                },() => {
                    this.convertIntoPierogiList(this.state.loversData[this.state.loversIterator]["pierogiBasic"]);
                });
            }
        });
    }
    async cupidDoingHisJob(params){
        const databack = await fetch("/user/loveIsInTheAir",params).then(
            back => back.json()
        ).then(
            (data) => {
                if(data == "loversAreOnTheWay"){
                    this.setState({
                        matchedName: this.state.loversData[this.state.loversIterator-1]["username"],
                        matchedEmail: this.state.loversData[this.state.loversIterator-1]["email"]
                    },() => {
                        this.infoSectionRef.current.style.display = "none";
                        this.photoSectionRef.current.style.display = "none";
                        this.matchedSectionRef.current.style.display = "block";
                        console.log(this.state.loversData[0]);
                    });
                }
                else{
                    //console.log(data);
                }
            }
        );
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
    prepareLoveParams(sendingObj){
        sendingObj["_token"] = this.props.sendingtoken;
        return {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(sendingObj)
        }
    }
    afterCupidJob(){
        if(this.state.loversIterator < this.state.loversData.length-1){
            this.setState({
                loversIterator: this.state.loversIterator+1
            },() => {});
        }
    }
    throwThisOut(){
        const insertNewFailedLoveParams = this.prepareLoveParams({
            email: this.state.loversData[this.state.loversIterator]["email"],
            status: -1
        });
        this.cupidDoingHisJob(insertNewFailedLoveParams);
        this.afterCupidJob();
    }
    makeTheMove(){
        const insertNewFailedLoveParams = this.prepareLoveParams({
            email: this.state.loversData[this.state.loversIterator]["email"],
            status: 1
        });
        this.cupidDoingHisJob(insertNewFailedLoveParams);
        this.afterCupidJob();
    }
    backToSearching(){
        this.matchedSectionRef.current.style.display = "none";
        this.photoSectionRef.current.style.display = "inline-block";
        this.infoSectionRef.current.style.display = "inline-block";
    }
    componentDidMount(){
        this.setState({
            isMounted: true
        },() => {});
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
        else if(this.state.outOfUsers == true){
            return(<section className="user-picker-container">
                <div className="no-users">Niestety aktualnie nie mamy nikogo w twoim typie. Sprawdź później 🧡</div>
        </section>);
        }
        else if(typeof(this.state.loversData) === "object" && this.state.loversData !==null){
            return(<section className="user-picker-container">
            <div className="photo-section" style={{
                background: 'red url("/user/profilePicture/'+this.state.loversData[this.state.loversIterator]["email"]+'")'
            }} ref = {this.photoSectionRef}>
                <div className="decision-panel">
                    <button className="panel-btn accept-btn" onClick = {() => {this.makeTheMove()}}>💘</button>
                    <button className="panel-btn deny-btn" onClick = {()=>{this.throwThisOut()}}>❌</button>
                </div>
            </div>
            <div className="info-section" ref = {this.infoSectionRef}>
                <header className="name-and-age">
                    {this.state.loversData === null ? "": this.state.loversData[this.state.loversIterator]["username"]+","+this.state.loversData[this.state.loversIterator]["age"]}
                </header>
                <div className="describe-container">{this.state.loversData === null ? "": this.state.loversData[this.state.loversIterator]["describe"]}</div>
                <div className="pierogi-section">
                    {this.state.pierogiRepresentative}
                    {this.state.pierogiList === null ? "" : this.prepareForeignPierogiStaff(this.state.loversData[this.state.loversIterator]["pierogiExtended"])}
                </div>
            </div>
            <section className="matched-couple" ref = {this.matchedSectionRef}>
            <header className="matched-couple-header">Love is in the air!</header>
            <div className="matched-info">Gratulacje! Ty i {this.state.matchedName} przypadliście sobie do gustu 💖</div>
            <div className="buttons-container">
                <a href = {"/user/chat/"+this.state.matchedEmail}>
                    <button className="matched-section-btn">Czat</button>
                </a>
                <button className="matched-section-btn" onClick = {() => {this.backToSearching()}}>Wróć</button>
            </div>
        </section>
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
