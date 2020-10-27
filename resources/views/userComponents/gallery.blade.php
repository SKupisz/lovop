@extends('layouts.app')
@section('content')
    @if (isset($data))
        @if(isset($data["errorContent"]))
            <div class="error-content">{{$data["errorContent"]}}</div>
        @elseif(isset($data["quantity"]))
            @if($data["quantity"] === 0)
                <header class="missing-matches">Wygląda na to, że nic tu nie ma</header>
                <div class="matches-advice">Zacznij szukać, aby nie było tu tak pusto</div>
            @else
                <header class="user-matches">Lubią Cię</header>
                <section class="lovers-container">
                    @for ($i = 0 ; $i < $data["quantity"]; $i++)
                        <a href = "/user/chat/{{$data['data'][$i][0]["email"]}}">
                            <div class="lover-widget" style = "background: rgba(255,0,0,.4) url('/user/profilePicture/{{$data['data'][$i][0]["email"]}}');">
                                <label for="" class="main-data-label">{{$data['data'][$i][0]["name"]}}, {{$data['data'][$i][0]["age"]}}</label>
                            </div>
                        </a>
                    @endfor
                </section>
            @endif
        @endif
    @endif
@endsection