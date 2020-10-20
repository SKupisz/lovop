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
    return view('welcome');
});
Route::get("/register",function(){
    return view("register");
});
Route::get("/about",function(){
    return view("about");
});
Route::get("/signin","SignInOutController@checkIfNotSignedIn");
Route::get("/confirmAccount","SignInOutController@authorizeNewUser");
Route::get("/user","UserActivities@mainLoop");
Route::get("/user/edit","UserActivities@editPanel");
Route::get("/logout","UserActivities@logout");
Route::post("/register","SignInOutController@registerNewUser");
Route::post("/signin","SignInOutController@SignInUser");
Route::post("/updateData","UserActivities@fillTheData");

Route::get("/user/support/randSomeNewLover","findSomebodyToLove@getTheListOfLovers");
Route::get("/user/profilePicture/{profileEmail}/","findSomebodyToLove@displayTheProfilePhoto");

