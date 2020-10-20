import React from "react";
import ReactDOM from "react-dom";

export default class Navbar extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(this.props.signed_in){
            return(
                <div class="main-navbar">
                    <nav class="main-nav">
                        <a href="/" class="main-logo main-nav-elems">
                            <span class="logo-text">Lovop</span>
                        </a>
                        <div class="main-nav-elems">Główna</div>
                        <div class="main-nav-elems">Szukaj</div>
                        <a href = "/about" className = "main-nav-elems">
                            O nas
                        </a>

                        <a href = "/logout" className = "main-nav-elems logout-elem">
                            Wyloguj
                        </a>
                        <a href = "/user/edit" className="main-nav-elems edit-elem">
                            Ustawienia
                        </a>
                    </nav>
                </div>
                );
        }
        else{
            return(
                <div class="main-navbar">
                    <nav class="main-nav">
                        <a href="/" class="main-logo main-nav-elems">
                            <span class="logo-text">Lovop</span>
                        </a>
                        <div class="main-nav-elems">Główna</div>
                        <div class="main-nav-elems">Szukaj</div>
                        <a href = "/about" className = "main-nav-elems">
                            O nas
                        </a>
                        <div class="dropdown dropdown-elem">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dołącz do nas
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="/signin">Zaloguj się</a>
                                <a class="dropdown-item" href="/register">Zarejestruj się</a>
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