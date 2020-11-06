<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\findSomebodyToLove;
use Carbon\Carbon;

class UserActivities extends Controller
{
    /*
        USER PARAMETERS INFORMATIONS

        mode: 0 - activation link expired, 1 - need more data, 2 - free to go

        directives: 1 - user data form
    */
    protected $UserActivities;
    public function __construct(findSomebodyToLove $UserActivities)
    {
        $this->findSomebodyToLove = $UserActivities;
    }
    function redirectToTheUser($errorName,$errorData){
        echo $errorName; // tutaj trzeba dorobić
    }
    function mainLoop(){
        if(!session()->get("signed_in") && !session()->get("mode")){
            return redirect("signin");
        }
        else{
            $mode = session()->get("mode");
            switch($mode){ 
                case 0:
                    return view("user")->with("linkExpired","expired");
                break;
                case 1: 
                    return view("user");
                break;
                case 2:
                    $usersData = $this->findSomebodyToLove->getTheListOfLovers();
                    return view("user")->with("usersToLoveData",$usersData);
                break;
                default:
                session()->forget("mode");
                session()->forget("signed_in");
                return redirect("signin");
                break;
            }
        }
    }
    function editPanel(){
        $getUserId = DB::table("users_primary_data")->where("email","=",session()->get("signed_in"))->value("id");
        $moreAccurateData = DB::select("SELECT name,surname,age,sex,liveIn,pierogiClassic,pierogiPersonal FROM users_ids WHERE primaryId = $getUserId");
        $moreAccurateData = json_decode(json_encode($moreAccurateData),true);
        return view("user")->with("directive",[1,$moreAccurateData]);
    }
    function fillTheData(Request $data){
        if($data->has("name") && $data->has("living-place") && $data->has("age") && $data->has("pierogiStandard") && ($data->has("man") || $data->has("woman"))){
            $name = $data->input("name");
            $livingPlace = $data->input("living-place");
            $age = (int)$data->input("age");
            $checkWhichClassicOption = (int)$data->input("pierogiStandard");

            if($age === null || $checkWhichClassicOption === null ){
                return redirect("user");
            }
            if($checkWhichClassicOption <=0){
                return redirect("user");
            }
            $sex = null;
            if($data->has("woman")){
                $sex = 1;
            }
            else if($data->has("man")){
                $sex = 2;
            }
            else{
                return redirect("user");
            }
            $name = htmlentities($name,ENT_QUOTES,"UTF-8");
            $livingPlace = htmlentities($livingPlace,ENT_QUOTES,"UTF-8");
            $surname = null;
            $pierogiPersonalType = null;
            if($data->has("surname")){
                $surname = $data->input("surname");
                $surname = htmlentities($surname,ENT_QUOTES,"UTF-8");
            }
            if($data->has("pierogiExtended")){
                $pierogiPersonalType = $data->input("pierogiExtended");
                $pierogiPersonalType = htmlentities($pierogiPersonalType,ENT_QUOTES,"UTF-8");
            }
            $now = Carbon::now();
            $dataForInsert = [
                "email" => session()->get("signed_in"),
                "name" => $name,
                "surname"=>$surname,
                "age" => $age,
                "sex" => $sex,
                "liveIn" => $livingPlace,
                "pierogiClassic" => $checkWhichClassicOption,
                "pierogiPersonal" => $pierogiPersonalType,
                "lastActive" => $now
            ];
            if($data->hasFile("profilePhoto")){
                $file_data = $data->file("profilePhoto");
                if($data->file("profilePhoto")->isValid()){
                    $dataForInsert["profilePhoto"] = file_get_contents($file_data);
                }
                else{
                    return $this->redirectToTheUser("Zdjęcie nie posiada adekwatnych parametrów",$dataForInsert);
                }
            }
            try {
                $getUserId = DB::table("users_primary_data")->where("email","=",session()->get("signed_in"))->value("id");
                $dataForInsert["primaryId"] = $getUserId;
                $searchForTheData = DB::table("users_ids")->where("primaryId","=",$getUserId)->count();
                if($searchForTheData == 0){
                    DB::table("users_ids")->insert($dataForInsert);
                    DB::table("users_primary_data")->where("id","=",$getUserId)->update(["confirmed"=>2]);
                    session("mode","2");
                }
                else{
                    unset($dataForInsert["primaryId"]);
                    DB::table("users_ids")->where("primaryId","=",$getUserId)->update($dataForInsert);
                    /*DB::table("defaultPics")->where("id","=",2)->update([
                        "file" => $dataForInsert["profilePhoto"]
                    ]);*/
                }
                return redirect("user");
            } catch (\Illuminate\Database\QueryException $e) {
                report($e);
                return $this->redirectToTheUser("Coś poszło nie tak. Spróbuj potem",$dataForInsert);
            }
        }
        else{
            return redirect("user");
        }
    }

    function makeAMatch(Request $data){
        if($data->has("email") && $data->has("status")){
            $email = $data->input("email");
            $status = $data->input("status");
            if($status != -1 && $status != 1){
                return json_encode("wrong status");
            }
            $email = htmlentities($email,ENT_QUOTES,"UTF-8");
            try {
                $checkIfThisAccountExists = DB::table("users_primary_data")->where("email","=",$email);
                if($checkIfThisAccountExists->count() == 0){
                    return json_encode("failedToMatch");
                }
                else{
                    $id = $checkIfThisAccountExists->value("id");
                    $getTheUserId = DB::table("users_primary_data")->where("email","=",session()->get("signed_in"))->value("id");
                    $checkIfThisMatchExists = DB::table("users_matches")->where("matchedId","=",$getTheUserId)->where("matcherId","=",$id);
                    if($checkIfThisMatchExists->count() != 0){
                        $currentStatus = $checkIfThisMatchExists->value("status");
                        if($currentStatus == -1){
                            return json_encode("failedLove");
                        }
                        else{
                            $rowId = $checkIfThisMatchExists->value("id");
                            DB::table("users_matches")->where("id","=",$rowId)->update([
                                "status" => 1
                            ]);
                            return json_encode("loversAreOnTheWay");
                        }
                    }
                    else{
                        if($status == -1){
                            DB::table("users_matches")->insert([
                                "matcherId" => $getTheUserId,
                                "matchedId" => $id,
                                "status" => -1
                            ]);
                        }
                        else{
                            DB::table("users_matches")->insert([
                                "matcherId" => $getTheUserId,
                                "matchedId" => $id,
                                "status" => 0
                            ]);
                        }
                        return json_encode("firstMoveDone");
                        
                    }
                }
            } catch (\Illuminate\Database\QueryException $e) {
                report($e);
                return json_encode("lost connection".$e->getMessage());
            }
        }
        else{
            return json_encode("failedToMatch");
        }
    }

    function belovedOnes(){
        try {
            $getTheId = DB::table("users_primary_data")->where("email","=",session()->get("signed_in"))->value("id");
            $getTheData = DB::select("SELECT * FROM users_matches WHERE (matcherId = $getTheId OR matchedId = $getTheId) AND status <> -1 LIMIT 50");
            $dataQuantity = count($getTheData);
            if($dataQuantity == 0){
                return view("userComponents.gallery")->with("data",["quantity"=>$dataQuantity]);
            }
            else{   
                $getTheData = json_decode(json_encode($getTheData),true);
                $dataToPass = [];
                for($i = 0 ; $i < $dataQuantity; $i++){
                    if($getTheData[$i]["matcherId"] == $getTheId){ 
                        $dataToPass[$i] = DB::table("users_ids")->select("name","age","email")->where("primaryId","=",$getTheData[$i]["matchedId"])->get();
                    }
                    else {
                        $dataToPass[$i] = DB::table("users_ids")->select("name","age","email")->where("primaryId","=",$getTheData[$i]["matcherId"])->get();
                    }
                    $dataToPass[$i] = json_decode(json_encode($dataToPass[$i]),true);
                }
                //return $dataToPass[1][0];
                return view("userComponents.gallery")->with("data",["quantity"=>$dataQuantity,"data"=>$dataToPass]);
            }
        } catch (\Illuminate\Database\QueryException $e) {
            report($e);
            return view("userComponents.gallery")->with("data",["errorContent" => "Coś poszło nie tak, spróbuj później"]);
        }
    }

    function logout(){
        session()->forget("signed_in");
        session()->forget("mode");
        return redirect("/");
    }
}
