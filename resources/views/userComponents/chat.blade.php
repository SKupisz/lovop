@extends("layouts.app")
@section('content')
    <section class="chat-container">
        <div id="chat-history-wrapper" class="chat-history" data-email="{{request()->route("emailWithChatting")}}" data-sendingtoken="{{csrf_token()}}"></div>
        <div id="chat-form-wrapper" data-email="{{request()->route("emailWithChatting")}}" data-sendingtoken="{{csrf_token()}}"></div>
    </section>
@endsection