import React from "react";
import ReactDOM from "react-dom";
import ReadingTheData from "./ReadingTheData.jsx";
import SendingForm from "./SendingForm.jsx";
import ChatOptionsWrapper from "./ChatOptions.jsx";
import { param } from "jquery";

export default class ChatOptions extends React.Component{
    constructor(props){
        super(props);
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

        this.backgroundColorRef = React.createRef();
        this.messBackgroundRef = React.createRef();
        this.messColorRef = React.createRef();

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
            this.currentStageOfOptions = 2;
        }
        else if(stageCase === "graphics"){
            this.optionsWrapperRef.current.classList.add("hidden");
            this.graphicsContainerRef.current.classList.remove("hidden");
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
    componentDidMount(){
        this.readTheGraphicData();
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
                    </div>
                    <div className="codes-wrapper hidden" ref = {this.codesContainerRef}>
                        <div className="option-codes" onClick = {() => {this.playCode(1)}}>Heart Game</div>
                    </div>
                    <div className="graphics-wrapper hidden" ref = {this.graphicsContainerRef}>
                        <div className="option-codes" onClick={()=>{this.resetGraphics(this.resetRoute)}}>Ustawienia fabryczne</div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.backgroundColorRef)}}>Tło konwersacji</div>
                        <div className="color-options hidden" ref = {this.backgroundColorRef}>
                            <div className="color-div red" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "red", "back")}}></div>
                            <div className="color-div green" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "green", "back")}}></div>
                            <div className="color-div blue" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "blue", "back")}}></div>
                            <div className="color-div white" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "white", "back")}}></div>
                            <div className="color-div gray" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "gray", "back")}}></div>
                            <div className="color-div purple" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "purple", "back")}}></div>
                            <div className="color-div cyan" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "cyan", "back")}}></div>
                            <div className="color-div magenta" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "magenta", "back")}}></div>
                            <div className="color-reset" onClick = {() => {this.changeBackground(this.convBackgroundRoute, "default", "back")}}>Ustawienia fabryczne</div>
                        </div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.messBackgroundRef)}}>Tło wiadomości</div>
                        <div className="color-options hidden" ref = {this.messBackgroundRef}>
                            <div className="color-div red" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "red", "mess")}}></div>
                            <div className="color-div green" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "green", "mess")}}></div>
                            <div className="color-div blue" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "blue", "mess")}}></div>
                            <div className="color-div white" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "white", "mess")}}></div>
                            <div className="color-div gray" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "gray", "mess")}}></div>
                            <div className="color-div purple" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "purple", "mess")}}></div>
                            <div className="color-div cyan" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "cyan", "mess")}}></div>
                            <div className="color-div magenta" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "magenta", "mess")}}></div>
                            <div className="color-reset" onClick = {() => {this.changeBackground(this.messBackgroundRoute, "default", "mess")}}>Ustawienia fabryczne</div>
                        </div>
                        <div className="option-codes" onClick = {() => {this.openSubSection(this.messColorRef)}}>Kolor czcionki</div>
                        <div className="color-options hidden" ref = {this.messColorRef}>
                            <div className="color-div red" onClick = {() => {this.changeBackground(this.messColorRoute, "red", "color")}}></div>
                            <div className="color-div green" onClick = {() => {this.changeBackground(this.messColorRoute, "green", "color")}}></div>
                            <div className="color-div blue" onClick = {() => {this.changeBackground(this.messColorRoute, "blue", "color")}}></div>
                            <div className="color-div white" onClick = {() => {this.changeBackground(this.messColorRoute, "white", "color")}}></div>
                            <div className="color-div gray" onClick = {() => {this.changeBackground(this.messColorRoute, "gray", "color")}}></div>
                            <div className="color-div purple" onClick = {() => {this.changeBackground(this.messColorRoute, "purple", "color")}}></div>
                            <div className="color-div cyan" onClick = {() => {this.changeBackground(this.messColorRoute, "cyan", "color")}}></div>
                            <div className="color-div magenta" onClick = {() => {this.changeBackground(this.messColorRoute, "magenta", "color")}}></div>
                            <div className="color-reset" onClick = {() => {this.changeBackground(this.messColorRoute, "default", "color")}}>Ustawienia fabryczne</div>
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