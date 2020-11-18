<input type="text" name="name" id="" required="required" placeholder="Imię" class="data-formInput" value="{{$directive[1][0]["name"]}}">
<input type="text" name="surname" id="" placeholder="Nazwisko (opcjonalnie)" class="data-formInput" value="{{$directive[1][0]["surname"]}}">
<input type="text" name="living-place" id="" placeholder="Miasto zamieszkania" class="data-formInput" value="{{$directive[1][0]["liveIn"]}}">
<input type="number" name="age" id="" min="13" required="required" placeholder="Wiek" class="data-formNumberInput" value="{{$directive[1][0]["age"]}}">
<div id = "user-describe" data-currentDesc="{{$directive[1][0]["currentDesc"]}}"></div>
<label for="fileInput" class="pick-up-a-photo" onclick = 'document.querySelector(".data-formFileInput").click()'>Zdjęcie (niewymagane)</label>
<input type="file" name="profilePhoto" id="" class="data-formFileInput" id = "fileInput"/>
<div class="sex-section">
    <header class="sex-section-header">Płeć</header>
    <div class="sex-answers" id = "sex-answers" data-currentSex="{{$directive[1][0]["sex"]}}">
    </div>
</div>
<div class="pierogi-section">
    <header class="pierogi-section-header">Wybierz swoje ulubione pierogi</header>
    <div class="pierogi-answers" id="pierogi-answers" data-currentCode="{{$directive[1][0]["pierogiClassic"]}}" data-currentPersonal="{{$directive[1][0]["pierogiPersonal"]}}"></div>
</div>
<button type="submit" class="data-formSubmit register-button">Zaktualizuj</button>