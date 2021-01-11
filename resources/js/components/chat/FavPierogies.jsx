import React from "react";

export default class FavPierogies extends React.Component{
    constructor(props){
        super(props);
        this.pierogiCode = this.props.classic;
        this.pierogiExtended = this.props.nonClassic;
        this.decodeClassic = this.decodeClassic.bind(this);
        this.pierogiNamesTable = [
            "Ze szpinakiem", "Z jagodami","Z serem",
            "Z kapustą i grzybami","Ruskie","Z mięsem"
        ];
        this.pierogiTable = [0,0,0,0,0,0];
        this.state = {
            flag: false
        };
    }
    decodeClassic(){
        let support = 0;
        for(let i = 0; i < 6; i++){
            support = this.pierogiCode % 2;
            this.pierogiTable[i] = support;
            this.pierogiCode-=support;
            this.pierogiCode/=2;
            i++;
        }
        this.setState({
            flag: true
        },() => {});
    }
    componentDidMount(){
        this.decodeClassic();
    }
    render(){
        return(
            <div className="">
                <div className="classic-pierogi-subsection">{
                    this.state.flag == false ? "" : this.pierogiNamesTable.map((pierogiName, index) => 
                        this.pierogiTable[index] == 1 ? <div className="pierogi-kind">{pierogiName}</div> : ""
                    )
                }</div>
                <div className="extended-pierogi-subsection">Inne: {this.pierogiExtended == "" ? "brak":this.pierogiExtended}</div>
            </div>
        );
    }
}