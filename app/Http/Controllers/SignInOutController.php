<?php

namespace App\Http\Controllers;

use Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

use App\Http\Controllers\UserActivities;

class SignInOutController extends Controller
{

    protected $UserActivities;
    public function __construct(UserActivities $UserActivities)
    {
        $this->UserActivities = $UserActivities;
    }

    function redirectToRegisterErrorCase($view,$errorContent,$data)
    {
        $errorData = [
            "errorMessage" => $errorContent,
            "email" => $data[0],
            "passwd" => $data[1],
            "passwdrep" => $data[2]
        ];
        return redirect($view)->with("errorPackage",$errorData);
    }
    function RandomString()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-_';
        $randstring = "";
        for ($i = 0; $i <10; $i++) {
            $randstring.= $characters[rand(0, strlen($characters)-1)];
        }
        return $randstring;
    }

    function checkIfNotSignedIn(){
        if(session()->get("signed_in") && session()->get("mode")){
            return redirect("/user");
        }
        else{
            return view("signin");
        }
    }

    function registerNewUser(Request $newUserData){
        if(!($newUserData->has("new-email") && $newUserData->has("new-passwd") && $newUserData->has("new-passwd-rep"))){ // check if all data are received
            return redirect("register");
        }
        else{
            $viewForRedirect = "register";
            $newEmail = $newUserData->input("new-email");
            $newPassword = $newUserData->input("new-passwd");
            $newPasswordRep = $newUserData->input("new-passwd-rep");
            $emailForSending = $newEmail;
            if(strlen($newPassword) < 8){
                return $this->redirectToRegisterErrorCase($viewForRedirect,"Hasło musi zawierać co najmniej 8 znaków",[$newEmail,$newPassword,$newPasswordRep]);
            }
            if($newPassword != $newPasswordRep){
                return $this->redirectToRegisterErrorCase($viewForRedirect,"Podane hasła nie są identyczne",[$newEmail,$newPassword,$newPasswordRep]);
            }
            $newEmail = htmlentities($newEmail,ENT_QUOTES,"utf-8");
            try {
                $checkIfExists = DB::select("SELECT * FROM users_primary_data WHERE email = '$newEmail'");
                $checkIfExists = json_decode(json_encode($checkIfExists),true);
                if(count($checkIfExists) != 0){
                    return $this->redirectToRegisterErrorCase($viewForRedirect,"Podany email jest już zarejestrowany",[$newEmail,$newPassword,$newPasswordRep]);
                }
                $newPassword = password_hash($newPassword,PASSWORD_DEFAULT);
                $linkToConfirm = $this->RandomString();
                $date = Carbon::now();
                $date->modify("+15 minutes");
                $dataToInsert = [
                    "email" => $newEmail,
                    "passwd" => $newPassword,
                    "confirmationLink" => $linkToConfirm,
                    "confirmationHighPoint" => $date,
                    "confirmed" => 0
                ];
                $mailSet = ["email"=>$emailForSending];

                Mail::send('emails.register', ["email" => $newEmail,"keycode"=>$dataToInsert["confirmationLink"]], function ($m) use ($mailSet){
                    $m->from('main@lovop.com', 'Lovop');
        
                    $m->to($mailSet["email"])->subject('Potwierdzenie założenia konta');
                });
                DB::table("users_primary_data")->insert($dataToInsert);
                return redirect("/register")->with("status","done");
            } catch (\Illuminate\Database\QueryException $e) {
                report($e);
                
                return $this->redirectToRegisterErrorCase($viewForRedirect,"Problemy techniczne. Spróbuj później",[$newEmail,$newPassword,$newPasswordRep]);
            }
        }
    }

    function SignInUser(Request $data){
        if($data->has("user-email") && $data->has("user-passwd")){
            $email = $data->input("user-email");
            $passwd = $data->input("user-passwd");
            $email = htmlentities($email,ENT_QUOTES,"utf-8");
            $viewForRedirect = "signin";
            try {
                $checkIfRegistered = DB::select("SELECT * FROM users_primary_data WHERE email = '$email'");
                $checkIfRegistered = json_decode(json_encode($checkIfRegistered),true);
                if(count($checkIfRegistered) == 0){
                    return $this->redirectToRegisterErrorCase($viewForRedirect,"Niepoprawny email lub hasło",[$email,$passwd,""]);
                }
                if(password_verify($passwd,$checkIfRegistered[0]["passwd"])){
                    if($checkIfRegistered[0]["confirmed"] == 0){
                        return $this->redirectToRegisterErrorCase($viewForRedirect,"Konto nie zostało aktywowane",[$email,$passwd,""]);
                    }
                    else
                    {
                        $mode = 2;
                        if($checkIfRegistered[0]["confirmed"] == 1){
                            $mode = 1;
                        }
                        else{
                            $now = Carbon::now();
                            DB::table("users_ids")->where("primaryId","=",$checkIfRegistered[0]["id"])->update([
                                "lastActive" => $now
                            ]);
                        }
                        session(["mode" => $mode, "signed_in"=>$email]);
                        return redirect("/user");
                    }
                }
                else{
                    return $this->redirectToRegisterErrorCase($viewForRedirect,"Niepoprawny email lub hasło",[$email,$passwd,""]);
                }
            } catch (\Illuminate\Database\QueryException $e) {
                report($e);
                return $this->redirectToRegisterErrorCase($viewForRedirect,"Problemy techniczne. Spróbuj później",[$email,$passwd,""]);
            }
        }
        else{
            return redirect("signin");
        }
    }

    function authorizeNewUser(Request $data){
        if(Input::has("code") && Input::has("user")){
            $code = Input::get("code");
            $user = Input::get("user");
            $checkIfRight = DB::table("users_primary_data")->where("email","=",$user)->where("confirmationLink","=",$code)->get();
            $counting = $checkIfRight->count();
            $checkIfRight = json_decode(json_encode($checkIfRight),true);
            if($counting != 1){
                return redirect("signin");
            }
            else{
                if($checkIfRight[0]["confirmed"] == 0){
                    $current = Carbon::now();
                    $id = $checkIfRight[0]["id"]; 
                    if($current <= $checkIfRight[0]["confirmationHighPoint"]){ 
                        DB::table("users_primary_data")->where("id","=",$id)->update(["confirmed" => 1]);
                        session(["mode" => 1, "signed_in"=>$user]);// 0 - data expired, 1 - need more info, 2 - let's go
                        return redirect("user");
                    }
                    else{
                        DB::table("users_primary_data")->where("id","=",$id)->delete();
                        session(["mode" => 0, "signed_in"=>$user]);
                        return $this->UserActivities->mainLoop();
                    }
                }    
                else{
                    $finalMode = 1;
                    if($checkIfRight[0]["confirmed"] == 2){
                        $finalMode = 2;
                    }
                    session(["mode" => $finalMode, "signed_in"=>$user]);
                    return $this->UserActivities->mainLoop();
                }            
            }
        }
        else{
            return redirect("signin");
        }

    }
}
