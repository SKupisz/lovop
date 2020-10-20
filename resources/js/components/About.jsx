import React from "react";
import ReactDOM from "react-dom";

export default class AboutUs extends React.Component{
    constructor(props){
        super(props);
        this.mainDescRef = React.createRef();
        this.secondDescRef = React.createRef();
    }
    render(){
        return(
            <section className="about-us-wrapper">
                <header className="main-header">O nas</header>
                <div className="main-describe" ref = {this.mainDescRef}>Czym jest Lovop? Jest to platforma randkowa, na której możesz znaleźć osobę o podobnym guście co Ty - do wyboru masz ponad 20 pierogów z naszej listy, a jeśli jesteś bardzo wybredny, możesz podać swoje indywidualne preferencje odnośnie najprawdopobniej najlepszego dania polskiej kuchni. Jak to z resztą się mówi, przez żołądek do serca 😉</div>
                <div className="second-describe" ref = {this.secondDescRef}>Skąd w ogóle wziął się pomysł na ten portal? Cóż, to długa historia... <div className="quote">"Gdybym miał powiedzieć co cenię w życiu najbardziej, powiedziałbym że... <span className = "people-scratched-off">ludzi</span> pierogi. Hmm, pierogi, które potrafią ucieszyć podniebienie w nawet najgorsze dni, kiedy sobie nie radzę, ale też kiedy sobie radzę znakomicie, by tak rzec" ~ Pierogis</div></div>
            </section>
        );
    }
}

if(document.getElementById("about-us")){
    ReactDOM.render(<AboutUs/>,document.getElementById("about-us"));
}