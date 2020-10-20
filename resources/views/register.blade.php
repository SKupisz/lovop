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
        <input type="email" name="new-email" id="" placeholder="Email" class="register-input" required value="{{Session::get('errorPackage')['email']}}"/>
        <input type="password" name="new-passwd" id="" placeholder="Hasło" class="register-input" required value="{{Session::get('errorPackage')['passwd']}}"/>
        <input type="password" name="new-passwd-rep" id="" placeholder="Powtórz hasło" class="register-input" required value="{{Session::get('errorPackage')['passwdrep']}}"/>
        <div class="error-container">
            <span class="error">{{Session::get("errorPackage")["errorMessage"]}}</span>
        </div>
        @else
        <input type="email" name="new-email" id="" placeholder="Email" class="register-input" required/>
        <input type="password" name="new-passwd" id="" placeholder="Hasło" class="register-input" required/>
        <input type="password" name="new-passwd-rep" id="" placeholder="Powtórz hasło" class="register-input" required/>
        @endif

        <input name="_token" type="hidden" value="{{ csrf_token() }}"/>

        <button type="submit" class="register-button">Zarejestruj się</button>
        {{ Form::close() }}
        @endif
    </section>
@endsection