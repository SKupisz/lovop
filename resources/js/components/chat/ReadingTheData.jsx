import React from "react";
import ReactDOM from "react-dom";

export default class ReadingTheData extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataToDisplay: null
        };
        this.getTheData = this.getTheData.bind(this);
        this.prepareNotResultDiv = this.prepareNotResultDiv.bind(this);
        this.historyRef = React.createRef();
    }
    prepareNotResultDiv(content){
        return <div className="not-result-div">{content}</div>;
    }
    processData(response){
        let endingContent = [], currentData = null;
        for(let i = 0 ; i < response.length; i++){
            currentData = response[i];
            if(currentData.fromm == "you"){
                endingContent.push(
                    <div className="message-div your-div">{currentData.content}</div>
                );
            }
            else{
                endingContent.push(
                    <div className="message-div other-div">{currentData.content}</div>
                );
            }
        }
        return <div className="result-div">{endingContent}</div>;
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
                this.setState({
                    dataToDisplay: this.processData(data)
                },() => {
                    this.historyRef.current.scrollTop = this.historyRef.current.scrollHeight;
                    setTimeout(function(){
                        this.getTheData();
                    }.bind(this),100);
                });
            }
        });
        
    }
    componentDidMount(){
        this.getTheData();
    }
    render(){
        return(
            <div class="chat-content" ref = {this.historyRef}>
                {this.state.dataToDisplay}
            </div>
        );
    }
}

if(document.getElementById("chat-history-wrapper")){
    const props = Object.assign({},document.getElementById("chat-history-wrapper").dataset);
    ReactDOM.render(<ReadingTheData {...props}/>, document.getElementById("chat-history-wrapper"));
}