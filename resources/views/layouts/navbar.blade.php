@if (Session::has("signed_in"))
<div id="navbar-wrapper" data-signed_in="true"></div>
@else
<div id="navbar-wrapper"></div>
@endif