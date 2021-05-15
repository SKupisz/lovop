import React from "react";
import ReactDOM from "react-dom";

export default class ReadingTheData extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataToDisplay: null,
            heartCounter: 0,
            isHeartOn: false
        };
        this.getTheData = this.getTheData.bind(this);
        this.prepareNotResultDiv = this.prepareNotResultDiv.bind(this);
        this.renderTheClickHeart = this.renderTheClickHeart.bind(this);
        this.renderCatchingGame = this.renderCatchingGame.bind(this);
        this.takeTheLoveShot = this.takeTheLoveShot.bind(this);
        this.takeTheShot = this.takeTheShot.bind(this);

        this.historyRef = React.createRef();
        this.heartRef = React.createRef();
        this.heartContainerRef = React.createRef();
    }
    prepareNotResultDiv(content){
        return <div className="not-result-div">{content}</div>;
    }
    processData(response){
        let endingContent = [], currentData = null;
        let graphicData = response[0], additional_classes = "";
        if(graphicData.message != "default"){
            additional_classes+=(graphicData.message+" ");
        }
        if(graphicData.color != "default"){
            additional_classes+=("color-"+graphicData.color+" ");
        }
        for(let i = 1 ; i < response.length; i++){
            currentData = response[i];
            if(currentData.sender == "you"){
                if(currentData.messageContent === "##hearts"){
                    endingContent.push(
                        <div className={"message-div your-div "+additional_classes}>🧡</div>
                    );
                }
                else{
                    endingContent.push(
                        <div className={"message-div your-div "+additional_classes}>{currentData.messageContent}</div>
                    );
                }
            }
            else{
                if(currentData.messageContent === "##hearts"){
                    endingContent.push(
                        <div className={"message-div other-div "+additional_classes}>🧡</div>
                    );
                    if(i == response.length - 1){
                        endingContent = this.renderTheClickHeart(endingContent);
                    }
                }
                else if(currentData.messageContent === "##catcher"){
                    endingContent.push(
                        <div className={"message-div other-div "+additional_classes}>🥟</div>
                    );
                    if(i == response.length - 1){
                        this.renderCatchingGame();
                    }
                }
                else{
                    endingContent.push(
                        <div className={"message-div other-div "+additional_classes}>{currentData.messageContent}</div>
                    );
                }
            }
        }
        return <div className="result-div">{endingContent}</div>;
    }
    async takeTheShot(params){
        const databack = await fetch("/user/chat/sendTheMessage",params)
        .then(back => back.json())
        .then(
            (data) => {
        });
    }
    takeTheLoveShot(){
        const messageParams = {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                content: "Kliknięcia serduszka: "+this.state.heartCounter,
                emailToWriteWith: this.props.email,
                 _token: this.props.sendingtoken
            })
        };
        this.takeTheShot(messageParams);
    }
    renderTheClickHeart(currentList){
        currentList.push(
            <div className="message-clickHeartContainer" ref = {this.heartContainerRef} onTimeUpdate={() => {this.heartContainerRef.style.visibility == "hidden" ? this.takeTheLoveShot() : ""}} onClick = {() => {this.setState({heartCounter: this.state.heartCounter+1},() => {
                this.heartRef.current.innerHTML = this.state.heartCounter;
            })}}>
                <div className="message-clickHeart">
                    <div className="main-heart-content">
                    </div>
                </div>
                <div className="times-label" ref = {this.heartRef}>{this.state.heartCounter}</div>
            </div>

        )
        this.setState({
            isHeartOn: true
        },() => {
            
        });
        if(this.state.isHeartOn == true){
            setTimeout(() => {this.takeTheLoveShot()},12000);
        }
        return currentList;
    }
    renderCatchingGame(){
        setTimeout(() => {

        },500);
        /*
                        <div className="dumpling-item dump-1">🥟</div>
                <div className="dumpling-item dump-2">🥟</div>
                <div className="dumpling-item dump-3">🥟</div>
                <div className="dumpling-item dump-4">🥟</div>
                <div className="dumpling-item dump-5">🥟</div>
                <div className="dumpling-item dump-6">🥟</div>
                <div className="dumpling-item dump-7">🥟</div>
                <div className="dumpling-item dump-8">🥟</div>
                <div className="dumpling-item dump-9">🥟</div>
        */
    }
    async getTheData(){
        const getTheData = await fetch("/user/getConvData/"+this.props.email,{
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        }).then(back => back.json())
        .then(data => {
            if(data == "no database"){
                this.setState({
                    dataToDisplay: this.prepareNotResultDiv("Napisz wiadomość, by rozpocząć konwersację")
                },() => {});
            }
            else if(data == "database error" || data == "no user found"){
                this.setState({
                    dataToDisplay: this.prepareNotResultDiv("Nie można nawiązać kontaktu. Spróbuj później")
                },() => {});
            }
            else{
                if(JSON.stringify(data) != this.currentStringifyResponse){
                    this.setState({
                        dataToDisplay: this.processData(data)
                    },() => {
                        this.currentStringifyResponse = JSON.stringify(data);
                        setTimeout(function(){
                            this.getTheData();
                        }.bind(this),100);
                    });
                }
                else{
                    setTimeout(function(){
                        this.getTheData();
                    }.bind(this),100);
                }
            }
        });
        
    }
    componentDidMount(){
        this.getTheData();
        
    }
    componentDidUpdate(){
        this.historyRef.current.scrollIntoView(false);
    }
    render(){
        return(
            <div class="chat-content" ref = {this.historyRef}>
                {this.state.dataToDisplay}
            </div>
        );
    }
}
/*
if(document.getElementById("chat-history-wrapper")){
    const props = Object.assign({},document.getElementById("chat-history-wrapper").dataset);
    ReactDOM.render(<ReadingTheData {...props}/>, document.getElementById("chat-history-wrapper"));
}*/