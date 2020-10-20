<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Lovop</title>

        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <style>
            body{
                margin: 0;
                padding: 0px 0px 30px 0px;
                background: url("https://cdn.dribbble.com/users/1463466/screenshots/4589038/tpp_dribbble_-14.jpg");
                background-repeat: repeat;
                background-size: cover;
            }
            .main-header{
                width: calc(90% - 20px);
                padding: 10px;
                display: block;
                margin-left: auto;
                margin-right: auto;
                text-align: center;
                font-size: 1.9em;
                font-family: "Bebas Neue",sans-serif;
                margin-bottom: 90px;
                color: rgba(255,255,255,.8);
                background: linear-gradient(90deg, transparent 0%,  rgba(223,71,35,.4) 70%,transparent 100%);
            }
            a{
                text-decoration: none !important;
                color: black;
            }
            .send-button{
                width: calc(40% - 20px);
                padding: 10px;
                display: block;
                margin-left: auto;
                margin-right: auto;
                font-size: 1.9em;
                font-family: "Bebas Neue",sans-serif;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: filter 0.4s;
                background: rgb(253,41,123);
                text-align: center;
                text-decoration: none;
            }
            .send-button:hover{
                filter: brightness(70%);
            }
        </style>
    </head>
    <body>
        <header class="main-header">Potwierdź swój email poprzez kliknięcie linku poniżej</header>
    <a href="http://localhost:8000/confirmAccount?user={{$email}}&code={{$keycode}}" target="_blank">
            <button class="send-button">Potwierdź</button>
        </a>
    </body>
</html>