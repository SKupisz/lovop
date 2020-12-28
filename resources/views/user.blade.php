@extends('layouts.app')
@section('content')
    @if (Session::get("mode")==0)
        @include("userComponents.linkexpired")    
    @elseif (Session::get("mode") == 1)
        <header class="new-user-welcome-header">Uzupełnij swój profil</header>
        @include("userComponents.dataForm")
    @elseif (isset($directive))
        @switch($directive[0])
        @case(1)
            <header class="new-user-welcome-header">{{Session::get("signed_in")}}</header>
            @include("userComponents.dataForm")
            @break
        @case(2)
            <header class="new-user-welcome-header">{{$directive[1][0]["errorContent"]}}</header>
            @include("userComponents.dataForm")
            @break
        @default
            @break
        @endswitch
    @else
        @include("userComponents.userPicker")
    @endif
@endsection