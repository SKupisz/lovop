@extends("layouts.app")
@section('content')
    <section class="register-form-wrapper">
        @if(Session::has("status"))
        <div class="registration-success-wrapper">
            <header class="registration-success">Wysłaliśmy na podany email link aktywacyjny. Po jego kliknięciu uzupełnij dane potrzebne do użytkowania portalu. Link wygasa po 15 minutach</header>
        </div>
        @else
        <header class="register-form-header">Zarejestruj się</header>
        {{ Form::open(array("url" => "register","class" => "register-form")) }}
        @if (Session::has("errorPackage"))
        <div class="input-container">
            <input type="email" name="new-email" id="signin-email-input" placeholder="Email" class="register-input" required value="{{Session::get('errorPackage')['email']}}"/>
            <button type="button" class="register-reset-btn" onClick = "getElementById('signin-email-input').value = ''">↺</button>
        </div>
        <div id="passwords-container" data-firstpasswd="{{Session::get('errorPackage')['passwd']}}" data-secondpasswd="{{Session::get('errorPackage')['passwdrep']}}"></div>   
        <div class="error-container">
            <span class="error">{{Session::get("errorPackage")["errorMessage"]}}</span>
        </div>
        @else
        <div class="input-container">
            <input type="email" name="new-email" id="signin-email-input" placeholder="Email" class="register-input" required/>
            <button type="button" class="register-reset-btn" onClick = "getElementById('signin-email-input').value = ''">↺</button>
        </div>
        <div id="passwords-container"></div>        
        @endif

        <input name="_token" type="hidden" value="{{ csrf_token() }}"/>

        <button type="submit" class="register-button">Zarejestruj się</button>
        {{ Form::close() }}
        @endif
    </section>
@endsection