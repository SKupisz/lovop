@extends('layouts.app')
@section('content')
    <section class="register-form-wrapper">
        <header class="register-form-header">Zaloguj się</header>
    {{ Form::open(array("url" => "signin", "class" => "signin-form"))}}
    @if (Session::has("errorPackage"))
    <input type="email" name="user-email" id="" placeholder="Email" class="register-input" required value="{{Session::get('errorPackage')['email']}}"/>
    <input type="password" name="user-passwd" id="" placeholder="Hasło" class="register-input" required value="{{Session::get('errorPackage')['passwd']}}"/>
    <div class="error-container">
        <span class="error">{{Session::get("errorPackage")["errorMessage"]}}</span>
    </div>
    @else
    <input type="email" name="user-email" id="" placeholder="Email" class="register-input" required/>
    <input type="password" name="user-passwd" id="" placeholder="Hasło" class="register-input" required/>
    @endif
    <input name="_token" type="hidden" value="{{ csrf_token() }}"/>

    <button type="submit" class="register-button">Zaloguj się</button>
    {{ Form::close() }}
    </section>>
@endsection