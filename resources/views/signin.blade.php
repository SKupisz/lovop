@extends('layouts.app')
@section('content')
    <section class="register-form-wrapper">
        <header class="register-form-header">Zaloguj się</header>
    {{ Form::open(array("url" => "signin", "class" => "signin-form"))}}
    @if (Session::has("errorPackage"))
    <div class="input-container">
        <input type="email" name="user-email" id="signin-email-input" placeholder="Email" class="register-input" required value="{{Session::get('errorPackage')['email']}}"/>
        <button type="button" class="register-reset-btn" onClick = "getElementById('signin-email-input').value = ''">↺</button>
    </div>
    <div id="passwords-container" data-ifsignin="true" data-firstpasswd="{{Session::get('errorPackage')['passwd']}}"></div>
    <div class="error-container">
        <span class="error">{{Session::get("errorPackage")["errorMessage"]}}</span>
    </div>
    @else
    <div class="input-container">
        <input type="email" name="user-email" id="signin-email-input" placeholder="Email" class="register-input" required/>
        <button type="button" class="register-reset-btn" onClick = "getElementById('signin-email-input').value = ''">↺</button>
    </div> 
    <div id="passwords-container" data-ifsignin="true"></div>
    @endif
    <input name="_token" type="hidden" value="{{ csrf_token() }}"/>

    <button type="submit" class="register-button">Zaloguj się</button>
    {{ Form::close() }}
    </section>>
@endsection