import React from "react";
import ReactDOM from "react-dom";

export default class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.mainRef = React.createRef();
        this.status = 0;
        this.openTheMenu = this.openTheMenu.bind(this);
    }
    openTheMenu(){
        if(this.status == 0){
            this.mainRef.current.classList.add("main-navbar-extended");
            this.status = 1;
        }
        else{
            this.mainRef.current.classList.remove("main-navbar-extended");
            this.status = 0;
        }
    }
    render(){
        if(this.props.signed_in){
            return(
                <div class="main-navbar" ref = {this.mainRef}>
                    <nav class="main-nav">
                        <div className="dropdown-open-mode" onClick = {() => {this.openTheMenu()}}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <a href="/" class="main-logo main-nav-elems">
                            <span class="logo-text">Lovop</span>
                        </a>
                        <a href = "/user">
                            <div class="main-nav-elems">Główna</div>
                        </a>
                        <a href = "/user/matches">
                            <div class="main-nav-elems">Lubicie się</div>
                        </a>
                        <a href = "/about" className = "main-nav-elems">
                            O nas
                        </a>
                        
                        <div className="settings-container">
                        <a href = "/user/edit" className="main-nav-elems edit-elem">
                            Ustawienia
                        </a>
                        <a href = "/logout" className = "main-nav-elems logout-elem">
                            Wyloguj
                        </a>
                        </div>
                    </nav>
                </div>
                );
        }
        else{
            return(
                <div class="main-navbar" ref = {this.mainRef}>
                    <nav class="main-nav">
                        <div className="dropdown-open-mode" onClick = {() => {this.openTheMenu()}}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <a href="/" class="main-logo main-nav-elems">
                            <span class="logo-text">Lovop</span>
                        </a>
                        <a href = "/">
                            <div class="main-nav-elems">Główna</div>
                        </a>
                        <a href = "/about" className = "main-nav-elems">
                            O nas
                        </a>
                        <div className="settings-container">
                            <div class="dropdown dropdown-elem">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Dołącz do nas
                                </button>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="/signin">Zaloguj się</a>
                                    <a class="dropdown-item" href="/register">Zarejestruj się</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                );
        }
    }
}

if(document.getElementById("navbar-wrapper")){

    const props = Object.assign({},document.getElementById("navbar-wrapper").dataset);

    ReactDOM.render(<Navbar {...props}/>, document.getElementById("navbar-wrapper"));
}