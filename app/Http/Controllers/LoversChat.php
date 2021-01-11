<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;
use Carbon\Carbon;

class LoversChat extends Controller
{
    function goChatting(){
        if(session()->get("signed_in") && session()->get("mode")){
            return view("userComponents.chat");
        }
        else{
            if(Cookie::get("signed_in") && Cookie::get("mode")){
                session(["signed_in" => Cookie::get("signed_in"),"mode"=> Cookie::get("mode")]);
                return view("userComponents.chat");
            }
            return redirect("/");
        }
    }
    function getTheId($profEmailSanitazed){
        try {
            $checkIfUserExist = DB::table("users_primary_data")->where("email","=",$profEmailSanitazed);
            $counter = $checkIfUserExist->count();
            if($counter != 1){
                return json_encode("no user found");
            }
            $adressId = $checkIfUserExist->value("id");
            return $adressId;
        } catch (Illuminate\Database\QueryException $e) {
            report($e);
            json_encode("database_error");
        }
    }
    function sendTheMessage(Request $data){
        if($data->has("content") && $data->has("emailToWriteWith") && $data->has("_token")){
            $content = $data->input("content");
            $content = htmlentities($content,ENT_QUOTES,"UTF-8");
            $profileEmail = $data->input("emailToWriteWith");
            $profEmailSanitazed = htmlentities($profileEmail,ENT_QUOTES,"UTF-8");
            try {
                $adressId = $this->getTheId($profEmailSanitazed);
                $email = session()->get("signed_in");
                $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
                $potentialDBName = $adressId."_".$primaryId."_c";
                $checkIfTheDataBaseNameRight = DB::select("SELECT * FROM information_schema.tables WHERE table_schema = 'lovop' AND table_name = '".$potentialDBName."' LIMIT 1");
                if(count($checkIfTheDataBaseNameRight) == 0){
                    $potentialDBName = $primaryId."_".$adressId."_c";
                    $checkIfTheDataBaseNameRight = DB::select("SELECT * FROM information_schema.tables WHERE table_schema = 'lovop' AND table_name = '".$potentialDBName."' LIMIT 1");
                    if(count($checkIfTheDataBaseNameRight) == 0){
                        $createTheTable = DB::statement("CREATE TABLE ".$potentialDBName." ( id INT NOT NULL AUTO_INCREMENT , fromm INT NOT NULL,content TEXT CHARACTER SET
                          utf8 COLLATE utf8_polish_ci NOT NULL ,sentAt DATETIME NOT NULL, PRIMARY KEY (id)) ENGINE = InnoDB CHARSET=utf8
                        COLLATE utf8_polish_ci;");
                    }
                }
                $insertTheData = DB::table($potentialDBName)->insert([
                    "fromm" => $adressId,
                    "content" => $content,
                    "sentAt"=> Carbon::now()
                ]);
                return json_encode("sent");
            } catch (Illuminate\Database\QueryException $e) {
                return json_encode("database error");
            }
        }
        else{
            return json_encode("missingData");
        }
    }
    function readTheGraphicsData(){
        if(session()->has("signed_in")){
            $profileEmail = session()->get("signed_in");
            try{
                $email = session()->get("signed_in"); 
                $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
                $getTheUsersPreferences = DB::table("users_chat_options")->select("convBackground as background","messBackground as message","messColor as color")->where("primaryId","=",$primaryId)->get();
                $getTheUsersPreferences = json_decode(json_encode($getTheUsersPreferences),true);
                return $getTheUsersPreferences;
            } catch(Illuminate\Database\QueryException $e){
                report($e);
                return json_encode("database error");
            }
        }
        else {
            return json_encode("necessary data missing");
        }
    }
    function readTheData($profileEmail){
        try {
            if(!isset($profileEmail)){
                return json_encode("no email");
            }
            $profEmailSanitazed = htmlentities($profileEmail,ENT_QUOTES,"UTF-8");
            $adressId = $this->getTheId($profEmailSanitazed);
            $email = session()->get("signed_in"); 
            $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
            $potentialDBName = $adressId."_".$primaryId."_c";
            $changingNames = "id, fromm as sender, content as messageContent, sentAt as sendingTime";
            $checkIfTheDataBaseNameRight = DB::select("SELECT * FROM information_schema.tables WHERE table_schema = 'lovop' AND table_name = '".$potentialDBName."' LIMIT 1");
            if(count($checkIfTheDataBaseNameRight) == 0){
                $potentialDBName = $primaryId."_".$adressId."_c";
                $checkIfTheDataBaseNameRight = DB::select("SELECT * FROM information_schema.tables WHERE table_schema = 'lovop' AND table_name = '".$potentialDBName."' LIMIT 1");
                if(count($checkIfTheDataBaseNameRight) == 0){
                    return json_encode("no database");
                }
            }
            $getTheReturnData = DB::table($potentialDBName)->select(DB::raw($changingNames))->take(100)->orderBy("sendingTime","asc")->get();
            $getTheReturnData = json_decode(json_encode($getTheReturnData),true);
            $finalTable = [];
            for($i = 0; $i < count($getTheReturnData); $i++){
                if($getTheReturnData[$i]["sender"] == $adressId){
                    $finalTable[$i]["sender"] = "you";
                }
                else{
                    $finalTable[$i]["sender"] = "other";
                }
                $finalTable[$i]["messageContent"] = $getTheReturnData[$i]["messageContent"];
                $finalTable[$i]["sendingTime"] = $getTheReturnData[$i]["sendingTime"];
            }
            $getTheGraphicData = $this->readTheGraphicsData();
            $finalTable = array_merge($getTheGraphicData,$finalTable);
            return json_encode($finalTable);


        } catch (Illuminate\Database\QueryException $e) {
            report($e);
            return json_encode("database error");
        }
    }
    function changeConvBackground(Request $data){
        if($data->has("newbackground") && $data->has("whatToUpdate")){
            $newMode = $data->input("newbackground");
            $updateMode = $data->input("whatToUpdate");
            $newMode = htmlentities($newMode, ENT_QUOTES, "UTF-8");
            $updateMode = htmlentities($updateMode,ENT_QUOTES, "UTF-8");
            if($updateMode != "back" && $updateMode != "mess" && $updateMode != "color") return json_encode("unapriopriate mode");
            $modes = ["red","green","blue","white","purple","gray","cyan","magenta","default"];
            if(!in_array($newMode,$modes)) return json_encode("status unknown");
            try {
                if(!session()->has("signed_in")) return json_encode("user not signed in");
                $email = session()->get("signed_in"); 
                $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
                if($updateMode == "back"){
                    $shot = DB::table("users_chat_options")->where("primaryId","=",$primaryId)->update([
                        "convBackground" => $newMode
                    ]);
                }
                else if($updateMode == "mess"){
                    $shot = DB::table("users_chat_options")->where("primaryId","=",$primaryId)->update([
                        "messBackground" => $newMode
                    ]);
                }
                else{
                    $shot = DB::table("users_chat_options")->where("primaryId","=",$primaryId)->update([
                        "messColor" => $newMode
                    ]); 
                }
                return json_encode("changed");
            } catch (Illuminate\Database\QueryException $e) {
                report($e);
                return json_encode("database error");
            }
        }
        else return json_encode("neccesary data missing");
    }
    function resetTheGraphics(Request $data){
        if(!session()->has("signed_in")) return json_encode("user not signed in");
        $email = session()->get("signed_in"); 
        try{
            $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
            $shot = DB::table("users_chat_options")->where("primaryId","=",$primaryId)->update([
                "convBackground" => "default",
                "messBackground" => "default",
                "messColor" => "default"
            ]);
            return json_encode("changed");
        } catch (Illuminate\Database\QueryException $e){
            report($e);
            return json_encode("database error");
        }
    }
    function readSupportData(Request $data){
        if(!$data->has("email")) return json_encode("missing necessary data");
        if(!session()->has("signed_in")) return json_encode("user not signed in");
        $email = $data->get("email");
        try{
            $primaryId = $this->getTheId($email);
            $getData = DB::table("users_ids")->select("name as username","surname as usersurname", "age as currentUserAge","liveIn as hometown","profileDesc as userCurrentDesc", "pierogiClassic as userStandardPierogies","pierogiPersonal as userExtendedPierogies")->where("primaryId","=",$primaryId)->get();
            $getData = json_decode(json_encode($getData),true);
            if($getData[0]["userCurrentDesc"] == "") $getData[0]["userCurrentDesc"] = "Brak opisu";
            $getData = json_encode($getData);
            return $getData;
        } catch (Illuminate\Database\QueryException $e){
            report($e);
            return json_encode("database error");
        }
    }
}
