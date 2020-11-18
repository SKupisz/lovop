<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LoversChat extends Controller
{
    function goChatting(){
        return view("userComponents.chat");
    }
    function sendTheMessage(Request $data){
        if($data->has("content") && $data->has("emailToWriteWith") && $data->has("_token")){
            $content = $data->input("content");
            $content = htmlentities($content,ENT_QUOTES,"UTF-8");
            $profileEmail = $data->input("emailToWriteWith");
            $profEmailSanitazed = htmlentities($profileEmail,ENT_QUOTES,"UTF-8");
            try {
                $checkIfUserExist = DB::table("users_primary_data")->where("email","=",$profEmailSanitazed);
                $counter = $checkIfUserExist->count();
                if($counter != 1){
                    return json_encode("no user found");
                }
                $adressId = $checkIfUserExist->value("id");
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
                return json_encode("database error".$e->getMessage());
            }
        }
        else{
            return json_encode("missingData");
        }
    }
    function readTheData($profileEmail){
        try {
            if(!isset($profileEmail)){
                return json_encode("no email");
            }
            $profEmailSanitazed = htmlentities($profileEmail,ENT_QUOTES,"UTF-8");
            $checkIfUserExist = DB::table("users_primary_data")->where("email","=",$profEmailSanitazed);
            $counter = $checkIfUserExist->count();
            if($counter != 1){
                return json_encode("no user found");
            }
            $adressId = $checkIfUserExist->value("id");
            $email = "szym-ku@wp.pl"; // only for test purposes - turn it back to the session value asap
            $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
            $potentialDBName = $adressId."_".$primaryId."_c";
            $checkIfTheDataBaseNameRight = DB::select("SELECT * FROM information_schema.tables WHERE table_schema = 'lovop' AND table_name = '".$potentialDBName."' LIMIT 1");
            if(count($checkIfTheDataBaseNameRight) == 0){
                $potentialDBName = $primaryId."_".$adressId."_c";
                $checkIfTheDataBaseNameRight = DB::select("SELECT * FROM information_schema.tables WHERE table_schema = 'lovop' AND table_name = '".$potentialDBName."' LIMIT 1");
                if(count($checkIfTheDataBaseNameRight) == 0){
                    return json_encode("no database");
                }
            }
            $getTheReturnData = DB::table($potentialDBName)->take(100)->orderBy("sentAt","asc")->get();
            $getTheReturnData = json_decode(json_encode($getTheReturnData),true);
            $finalTable = [];
            for($i = 0; $i < count($getTheReturnData); $i++){
                if($getTheReturnData[$i]["fromm"] == $adressId){
                    $finalTable[$i]["fromm"] = "you";
                }
                else{
                    $finalTable[$i]["fromm"] = "other";
                }
                $finalTable[$i]["content"] = $getTheReturnData[$i]["content"];
                $finalTable[$i]["sentAt"] = $getTheReturnData[$i]["sentAt"];
            }
            return json_encode($finalTable);


        } catch (Illuminate\Database\QueryException $e) {
            report($e);
            return json_encode("database error");
        }
    }
}
