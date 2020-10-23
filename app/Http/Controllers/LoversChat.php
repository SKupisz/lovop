<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoversChat extends Controller
{
    function goChatting(){
        return view("userComponents.chat");
    }
}
