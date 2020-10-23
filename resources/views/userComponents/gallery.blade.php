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
                @for ($i = 0 ; $i < $data["quantity"]; $i++)
                    
                @endfor
            @endif
        @endif
    @endif
@endsection