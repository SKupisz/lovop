import React from "react";
import ReactDOM from "react-dom";

export default class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.mainRef = React.createRef();
        this.openTheMenu = this.openTheMenu.bind(this);
    }
    openTheMenu(){
        this.mainRef.current.classList.contains("main-navbar-extended") ? this.mainRef.current.classList.remove("main-navbar-extended") : this.mainRef.current.classList.add("main-navbar-extended");
    }
    render(){
        return(
            <div className="main-navbar" ref = {this.mainRef}>
                <nav className="main-nav">
                    <div className="dropdown-open-mode" onClick = {() => {this.openTheMenu()}}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <a href="/" className="main-logo main-nav-elems">
                        <span className="logo-text">Lovop</span>
                    </a>
                    <a href = "/user">
                        <div className="main-nav-elems">Główna</div>
                    </a>
                    {this.props.signed_in ?                         
                    <a href = "/user/matches">
                        <div className="main-nav-elems">Lubicie się</div>
                    </a> : ""}

                    <a href = "/about" className = "main-nav-elems">
                        O nas
                    </a>
                    {this.props.signed_in ?                         
                    <div className="settings-container">
                        <a href = "/user/edit" className="main-nav-elems edit-elem">
                            Ustawienia
                        </a>
                        <a href = "/logout" className = "main-nav-elems logout-elem">
                            Wyloguj
                        </a>
                    </div> :
                    <div className="settings-container">
                        <div className="dropdown dropdown-elem">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dołącz do nas
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" href="/signin">Zaloguj się</a>
                                <a className="dropdown-item" href="/register">Zarejestruj się</a>
                            </div>
                        </div>
                    </div>}
                </nav>
            </div>
            );
    }
}

if(document.getElementById("navbar-wrapper")){

    const props = Object.assign({},document.getElementById("navbar-wrapper").dataset);

    ReactDOM.render(<Navbar {...props}/>, document.getElementById("navbar-wrapper"));
}