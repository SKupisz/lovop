<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if(session()->get("signed_in")){
        return redirect("user");
    }
    else{
        return view('welcome');
    }
    
});
Route::get("/register",function(){
    if(session()->get("signed_in")){
        return redirect("user");
    }
    else{
        return view("register");
    }
    
});
Route::get("/about",function(){
    return view("about");
});
Route::get("/signin","SignInOutController@checkIfNotSignedIn");
Route::get("/confirmAccount","SignInOutController@authorizeNewUser");
Route::get("/user","UserActivities@mainLoop");
Route::get("/user/edit","UserActivities@editPanel");
Route::get("/user/chat/{emailWithChatting}","LoversChat@goChatting");
Route::get("/user/matches","UserActivities@belovedOnes");
Route::get("/logout","UserActivities@logout");
Route::post("/register","SignInOutController@registerNewUser");
Route::post("/signin","SignInOutController@SignInUser");
Route::post("/updateData","UserActivities@fillTheData");

Route::post("/user/chat/sendTheMessage","LoversChat@sendTheMessage");
Route::post("/user/chatSupport/modifyChatBackground","LoversChat@changeConvBackground");
Route::post("/user/chatSupport/modifyMessBackground","LoversChat@changeConvBackground");
Route::post("/user/chatSupport/modifyMessColor","LoversChat@changeConvBackground");
Route::post("/user/chatSupport/resetAll","LoversChat@resetTheGraphics");
Route::get("/user/chatSupport/getTheGraphicsData","LoversChat@readTheGraphicsData");

Route::post("/user/loveIsInTheAir","UserActivities@makeAMatch");
Route::get("/user/support/randSomeNewLover","findSomebodyToLove@getTheListOfLovers");
Route::get("/user/profilePicture/{profileEmail}/","findSomebodyToLove@displayTheProfilePhoto");
Route::get("/user/getConvData/{profileEmail}","LoversChat@readTheData");
