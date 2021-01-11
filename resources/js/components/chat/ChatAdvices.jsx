import React from "react";

export default class ChatAdvices extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            finalAdvice: ""
        };
        this.adviceList = [
            "Dobre jedzenie na pewno pomoże wam przełamać lody - zaproponuj wyjście do restauracji 😉",
            "Zobaczmy, ile zdoła dla Ciebie wyklikać - uruchom minigrę heart clicker w panelu gier lub wpisując ##hearts",
            "Pokomplementuj trochę - to powinno was zbliżyć do siebie 🥰",
            "Spróbuj zagaić rozmowę o filmach, książkach itp. - może znajdziecie jakieś wspólne preferencje artystyczne? 😉",
            "A może by tak was trochę rozruszać? Pomyśl o wspólnym wyjściu na dyskotekę lub imprezę"
        ];
    }
    componentDidMount(){
        this.setState({
            finalAdvice: this.adviceList[Math.floor(Math.random()*5)]
        }, () => {});
    }
    render(){
        return(
            <div className="">
                <div className="advice">
                    <label htmlFor="" className="advice-content">{this.state.finalAdvice}</label>
                </div>
            </div>
        )
    }
}