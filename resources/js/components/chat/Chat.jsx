import React from "react";
import ReactDOM from "react-dom";
import ReadingTheData from "./ReadingTheData.jsx";
import SendingForm from "./SendingForm.jsx";
import GraphicsSubSection from "./GraphicsSubSection.jsx";
import FavPierogies from "./FavPierogies.jsx";
import ChatAdvices from "./ChatAdvices.jsx";
import { param } from "jquery";

export default class ChatOptions extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            usersurname: "",
            age: 0,
            town: "",
            description: "",
            pierogiCode: 0,
            pierogiStr: ""
        };
        this.showing = 0;
        this.previousClass = "";
        this.convBackgroundRoute = "/user/chatSupport/modifyChatBackground";
        this.messBackgroundRoute = "/user/chatSupport/modifyMessBackground";
        this.messColorRoute = "/user/chatSupport/modifyMessColor";
        this.resetRoute = "/user/chatSupport/resetAll";
        this.currentStageOfOptions = 0; // 0 - not opened, 1 - menu opened, 2 - specific kind of options opened
        this.mainContentRef = React.createRef();
        this.optionsRef = React.createRef();
        this.historyRef = React.createRef();
        this.writingRef = React.createRef();

        this.optionsWrapperRef = React.createRef();
        this.codesRef = React.createRef();
        this.codesContainerRef = React.createRef();
        this.graphicsContainerRef = React.createRef();
        this.supportContainerRef = React.createRef();

        this.backgroundColorRef = React.createRef();
        this.messBackgroundRef = React.createRef();
        this.messColorRef = React.createRef();

        this.generalInfoRef = React.createRef();
        this.pierogiInfoRef = React.createRef();
        this.pieceOfAdviceRef = React.createRef();

        this.OpenTheOptions = this.OpenTheOptions.bind(this);
        this.runSecondStage = this.runSecondStage.bind(this);
        this.playCode = this.playCode.bind(this);
        this.sendSpecialMessage = this.sendSpecialMessage.bind(this);
        this.takeTheShot = this.takeTheShot.bind(this);
        this.resetCodes = this.resetCodes.bind(this);
        this.fallBack = this.fallBack.bind(this);
        this.openSubSection = this.openSubSection.bind(this);
        this.changeBackground = this.changeBackground.bind(this);
        this.readTheGraphicData = this.readTheGraphicData.bind(this);
        this.resetGraphics = this.resetGraphics.bind(this);
        this.readTheSupportData = this.readTheSupportData.bind(this);
        this.clickCallback = this.clickCallback.bind(this);
    }
    OpenTheOptions(){
        if(this.showing == 0){
            this.mainContentRef.current.classList.remove("hidden");
            this.historyRef.current.classList.add("hidden");
            this.writingRef.current.classList.add("hidden");
            this.currentStageOfOptions = 1;
            this.showing = 1;
        }
        else{
            this.mainContentRef.current.classList.add("hidden");
            this.historyRef.current.classList.remove("hidden");
            this.writingRef.current.classList.remove("hidden");
            this.showing = 0;         
            this.currentStageOfOptions = 1;  
        }
    }
    runSecondStage(stageCase){
        if(stageCase === "codes"){
            this.optionsWrapperRef.current.classList.add("hidden");
            this.codesContainerRef.current.classList.remove("hidden");
            this.supportContainerRef.current.classList.add("hidden");
            this.currentStageOfOptions = 2;
        }
        else if(stageCase === "graphics"){
            this.optionsWrapperRef.current.classList.add("hidden");
            this.graphicsContainerRef.current.classList.remove("hidden");
            this.supportContainerRef.current.classList.add("hidden");
            this.currentStageOfOptions = 2;
        }
        else if(stageCase === "support"){
            this.optionsWrapperRef.current.classList.add("hidden");
            this.graphicsContainerRef.current.classList.add("hidden");
            this.supportContainerRef.current.classList.remove("hidden");
            this.currentStageOfOptions = 2;
        }
    }
    async takeTheShot(route, params){
        const databack = await fetch(route,params)
        .then(back => back.json())
        .then( (data) => {
            
        } );
    }
    sendSpecialMessage(contentToGo){
        const messageParams = {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                content: contentToGo,
                emailToWriteWith: this.props.email,
                 _token: this.props.sendingtoken
            })
        };
        this.takeTheShot("/user/chat/sendTheMessage", messageParams);
    }
    resetCodes(){
        this.codesContainerRef.current.classList.add("hidden");
        this.optionsWrapperRef.current.classList.remove("hidden");
        this.mainContentRef.current.classList.add("hidden");
        this.historyRef.current.classList.remove("hidden");
        this.writingRef.current.classList.remove("hidden");
    }
    playCode(codeID){
        switch(codeID){
            case 1: // heart's minigame
                this.sendSpecialMessage("##hearts");
                this.resetCodes();
                break;
            case 2:
                this.sendSpecialMessage("##catcher");
                this.resetCodes();
                break;
            default:
                break;
        }
    }
    fallBack(){
        this.currentStageOfOptions--;
        if(this.currentStageOfOptions == 1){
            this.optionsWrapperRef.current.classList.remove("hidden");
            this.codesContainerRef.current.classList.add("hidden");
            this.graphicsContainerRef.current.classList.add("hidden");
            this.supportContainerRef.current.classList.add("hidden");
        }
        else{
            this.OpenTheOptions();
        }
    }
    openSubSection(refToOpen){
        if(refToOpen.current.classList.contains("hidden")) refToOpen.current.classList.remove("hidden");
        else refToOpen.current.classList.add("hidden");
    }
    async readTheGraphicData(){
        const getTheData = fetch("/user/chatSupport/getTheGraphicsData/",{
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        }).then(back => back.json())
        .then(data => {
            if(this.previousClass != ""){
                this.mainContentRef.current.classList.remove(this.previousClass);
                this.historyRef.current.classList.remove(this.previousClass);
            }
            if(data[0].background != "default"){
                this.previousClass = data[0].background;
                this.mainContentRef.current.classList.add(this.previousClass);
                this.historyRef.current.classList.add(this.previousClass);
            }
            else{
                this.previousClass = "";
            }
        });
    }
    async readTheSupportData(){
        const getTheData = fetch("/user/chatSupport/getTheSupportData/",{
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                _token: this.props.sendingtoken,
                email: this.props.email
            })
        }).then(back => back.json())
        .then(data => {
            this.setState({
                username: data[0].username,
                usersurname: data[0].usersurname,
                age: data[0].currentUserAge,
                town: data[0].hometown,
                description: data[0].userCurrentDesc,
                pierogiCode: data[0].userStandardPierogies,
                pierogiStr: data[0].userExtendedPierogies
            },() => {});
        })
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
        this.takeTheShot(route,params).then(() => {this.readTheGraphicData();});
    }
    resetGraphics(route){
        const params = {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                _token: this.props.sendingtoken
            })
        };
        this.takeTheShot(route,params).then(() => {this.readTheGraphicData();});
    }
    clickCallback(){
        this.readTheGraphicData();
    }
    componentDidMount(){
        this.readTheGraphicData();
        this.readTheSupportData();
    }
    render(){
        return(
            <section class="chat-container">
            <div id="chat-options" className="chat-options">
            <div className="options-container">
                <div className="hamburger" onClick = {() => {this.OpenTheOptions()}}>
                    <div className="hamburger-hor"></div>
                    <div className="hamburger-hor"></div>
                    <div className="hamburger-hor"></div>
                </div>
                <section className="options-main-content hidden" ref={this.mainContentRef}>
                    <div className="fall-back" onClick = {() => {this.fallBack()}}>⬅</div>
                    <div className="content-wrapper" ref = {this.optionsWrapperRef}>
                        <div className="option-codes" ref = {this.codesRef} onClick = {() => {this.runSecondStage("codes");}}>Kody</div>
                        <div className="option-codes" ref = {this.codesRef} onClick = {() => {this.runSecondStage("graphics");}}>Grafika</div>
                        <div className="option-codes" ref = {this.codesRef} onClick = {() => {this.runSecondStage("support");}}>Wsparcie rozmowy</div>
                    </div>
                    <div className="codes-wrapper hidden" ref = {this.codesContainerRef}>
                        <div className="option-codes" onClick = {() => {this.playCode(1)}}>Heart Game</div>
                    </div>
                    <div className="graphics-wrapper hidden" ref = {this.graphicsContainerRef}>
                        <div className="option-codes" onClick={()=>{this.resetGraphics(this.resetRoute)}}>Ustawienia fabryczne</div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.backgroundColorRef)}}>Tło konwersacji</div>
                        <div className="color-options hidden" ref = {this.backgroundColorRef}>
                            <GraphicsSubSection changeRoute = {this.convBackgroundRoute} clickCallback = {this.clickCallback}/>
                        </div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.messBackgroundRef)}}>Tło wiadomości</div>
                        <div className="color-options hidden" ref = {this.messBackgroundRef}>
                            <GraphicsSubSection changeRoute = {this.messBackgroundRoute} clickCallback = {this.clickCallback}/>
                        </div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.messColorRef)}}>Kolor czcionki</div>
                        <div className="color-options hidden" ref = {this.messColorRef}>
                            <GraphicsSubSection changeRoute = {this.messColorRoute} clickCallback = {this.clickCallback}/>
                        </div>
                    </div>
                    <div className="support-wrapper hidden" ref = {this.supportContainerRef}>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.generalInfoRef)}}>Informacje ogólne</div>
                        <div className="color-options hidden" ref = {this.generalInfoRef}>
                            <div className="support-label">Nazwa: {this.state.username+" "+this.state.usersurname}</div>
                            <div className="support-label">Wiek: {this.state.age}</div>
                            <div className="support-label">Miasto: {this.state.town}</div>
                            <div className="support-label">Opis: {/*this.state.description*/}Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</div>
                        </div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.pierogiInfoRef)}}>Ulubione pierogi</div>
                        <div className="color-options hidden" ref = {this.pierogiInfoRef}>
                            {this.state.pierogiCode == 0 ? "Ładowanie..." : <FavPierogies classic = {this.state.pierogiCode} nonClassic = {this.state.pierogiStr}/>}
                        </div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.pieceOfAdviceRef)}}>Porady</div>
                        <div className="color-options hidden" ref = {this.pieceOfAdviceRef}>
                            <ChatAdvices/>
                        </div>
                    </div>
                </section>
            </div>
            </div>
            <div id="chat-history-wrapper" className="chat-history" ref = {this.historyRef}>
            <ReadingTheData email={this.props.email} sendingtoken = {this.props.sendingtoken}/>
            </div>
            <div id="chat-form-wrapper" ref = {this.writingRef}>
            <SendingForm email={this.props.email} sendingtoken = {this.props.sendingtoken}/>
            </div>
        </section>
        )
    }
}

if(document.getElementById("chat-container-div")){
    const props = Object.assign({},document.getElementById("chat-container-div").dataset);
    ReactDOM.render(<ChatOptions {...props}/>,document.getElementById("chat-container-div"));
}