<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class findSomebodyToLove extends Controller
{
    protected function toBinary($number){
        $finalTable = [];
        $i = 0;
        while($number > 0){
            $finalTable[$i] = $number%2;
            $number = (int)$number/2;
            $i++;
        }
        $finalTable = array_reverse($finalTable);
        return $finalTable;
    }
    function associations($userNumber,$foreginNumber){
        $userTable = $this->toBinary($userNumber);
        $foreignTable = $this->toBinary($foreginNumber);
        $len = min(count($userTable),count($foreignTable));
        $totalInCommon = 0;
        for($i = 0 ; $i < $len; $i++){
            $first = $userTable[count($userTable)-$i-1];
            $second = $userTable[count($foreignTable)-$i-1];
            if($first === $second) $totalInCommon++;
        }
        return ($totalInCommon/$len);
    }
    
    function getTheListOfLovers(){
        if(!session()->get("signed_in"))
            return 0;
        else{
            $email = session()->get("signed_in");
            try {
                $primaryId = DB::table("users_primary_data")->where("email","=",$email)->value("id");
                $dataRow = DB::select("SELECT primaryId,sex,age,liveIn,pierogiClassic FROM users_ids WHERE primaryId = $primaryId");
                $dataRow = json_decode(json_encode($dataRow),true);
                $searcher = 2;
                if($dataRow[0]["sex"] == 2) $searcher = 1;
                $loversData = DB::table("users_ids")->take(100)->select("primaryId","name","surname","email","age","pierogiClassic","pierogiPersonal","lastActive")->where("sex","=",$searcher);
                $loversData = $loversData->where("liveIn","like","%".$dataRow[0]["liveIn"]."%");
                $usersAge = $dataRow[0]["age"];
                if($usersAge < 16){
                    $loversData = $loversData->where("age","<",16);
                }
                else {
                    $loversData = $loversData->where("age",">=",16);
                }
                $counter = $loversData->count();
                $loversData = $loversData->get();
                $loversData = json_decode(json_encode($loversData),true);
                $finalGradesTable = [];
                $conveters = [
                    "pierogiConverter" => 0.4,
                    "timeConverter" => 0.3,
                    "ageConverter" => 0.3
                ];
                for($i = 0 ; $i < $counter; $i++){
                    $rowToAnalyze = $loversData[$i];
                    $exactPierogies = $this->associations($dataRow[0]["pierogiClassic"],$rowToAnalyze["pierogiClassic"]);
                    $now = Carbon::now();
                    $delay = $now->diffInDays($rowToAnalyze["lastActive"]);
                    $ageDifference = min($dataRow[0]["age"],$rowToAnalyze["age"])/max($dataRow[0]["age"],$rowToAnalyze["age"]);
                    $finalGradesTable[$i] = $exactPierogies*$conveters["pierogiConverter"]+(1/($delay+1))*$conveters["timeConverter"]+$ageDifference*$conveters["ageConverter"];
                    $finalGradesTable[$i] = round($finalGradesTable[$i],3);
                    $loversData[$i]["finalGrade"] = $finalGradesTable[$i];
                    //echo $rowToAnalyze["name"]." ".$finalGradesTable[$i]."<br>";
                }
                array_multisort(array_map(function($element) {
                    return $element['finalGrade'];
                }, $loversData), SORT_DESC, $loversData);
                $finalData = [];
                $loversData = array_map(function($element) use ($dataRow) {
                    $searchIfMatched = DB::table("users_matches")->where("matcherId","=",$dataRow[0]["primaryId"])->where("matchedId","=",$element["primaryId"])->count();
                    if($searchIfMatched == 0){
                        return [
                            "username" => $element["name"],
                            "familyname" => $element["surname"],
                            "age" => $element["age"],
                            "pierogiBasic" => $element["pierogiClassic"],
                            "pierogiExtended" => $element["pierogiPersonal"],
                            "email" =>$element["email"]
                        ];
                    }
                },$loversData);
                $loversData = array_values(array_filter($loversData,function($value) { return !is_null($value) && $value !== '';})); // filtering from null when this girl has already been matched
                $loversData = json_encode($loversData);
                return $loversData;
            } catch (\Illuminate\Database\QueryException $e) {
                report($e);
                return json_encode("error".$e);
            }
        }
    }

    function notUserPhotoSupport($case){
        $searchedId = 2;
        $alfa = DB::table("defaultPics")->where("id","=",$searchedId)->value("file");
        header("Content-type: jpg");
        echo $alfa;
    }
    function displayTheProfilePhoto($profileEmail){
        try {
            $getTheId = DB::table("users_primary_data")->where("email","=",$profileEmail)->value("id");
            if($getTheId === null){
                $this->notUserPhotoSupport(2);
            }
            else{
                $basicForGettingData = DB::table("users_ids")->where("primaryId","=",$getTheId);
                $loadTheFormat = $basicForGettingData->value("profilePhotoFormat");
                $loadTheBlob = $basicForGettingData->value("profilePhoto");
                if($loadTheBlob === null){
                    $this->notUserPhotoSupport(2);
                }
                else{
                    header("Content-type: ".$loadTheFormat);
                    echo $loadTheBlob;
                }
            }

        } catch (\Illuminate\Database\QueryException $e) {
            report($e);
            $this->notUserPhotoSupport(2);
        }
    }
}
