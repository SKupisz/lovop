<div class="data-form-wrapper">
    {{ Form::open(array("url"=>"updateData","class"=>"data-form","enctype"=>"multipart/form-data")) }}
        <input name="_token" type="hidden" value="{{ csrf_token() }}"/>
        @if(isset($directive) || isset($errorData))
        @include("userComponents.sub.formWithData")
        @else
        @include("userComponents.sub.formWithoutData")
        @endif
    {{ Form::close() }}
</div>