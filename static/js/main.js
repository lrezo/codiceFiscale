'use strict';


(function (){
    $(document).ready(function () {
//change selectboxes to selectize mode to be searchable
        $("select").select2({
            containerCss : {"display":"flex"}
        });

    });

    const form = document.querySelector("form");
    const nameField = document.querySelector("#nome");
    const lastNameField = document.querySelector("#cognome");
    const dateOfBirthField = document.querySelector("#data-di-nascita");
    const sexField = document.querySelectorAll("input[type=radio]");
    const errName = document.querySelector("#errName");
    const errLastName = document.getElementById("errLastName");
    const errDateOfBirth = document.getElementById("errDateOfBirth");
    const errGender = document.getElementById("errGender");
    const codiceFiscale = document.querySelector(".codiceFiscale");
    const jQueryPaesiEsteri = $('select#paesiEsteri');
    const jQueryComuniDiNascita = $('select#comuneDiNascita');
    const foreignCountries = document.getElementById("paesiEsteri");
    const comuniItaliani = document.getElementById("comuneDiNascita");
    dateOfBirthField.valueAsDate = new Date();
/*    const provinciaComuneSiglaField = document.getElementById("provinciaComuneSigla");*/
    async function listaPaesi(){
        const data  = await fetch("./static/data/listaPaesiEsteri.json").then(response => response.json())
        data.forEach(paese =>{
            foreignCountries.insertAdjacentHTML("beforeend",`<option value=${paese["Denominazione "]} codice=${paese["Codice Catastale "]}>${paese["Denominazione "]}</option>`)
        })
    }


    async function liStaComuni(){
        const data  = await fetch("./static/data/comuniItalia.json").then(response => response.json())
        data.forEach(paese =>{
            comuniItaliani.insertAdjacentHTML("beforeend",`<option value=${paese["DESCRIZIONE COMUNE"]} sigla=${paese["SIGLA"]} codice=${paese["CODICE BELFIORE"]}>${paese["DESCRIZIONE COMUNE"]}</option>`)
        })
    }

    listaPaesi();
    liStaComuni();

    function resetForm(){
        nameField.value = "";
        lastNameField.value = "";
        dateOfBirthField.valueAsDate = new Date();
        sexField.forEach(sex =>{
            sex.checked =false;
        });
    }

    function hideErrors(){
        errName.style.display="none";
        errLastName.style.display="none";
        errDateOfBirth.style.display="none";
        errGender.style.display="none";
    }

    function setErrorMessage(nameElement,message){
        nameElement.style.display="block";
        nameElement.textContent=message;
    }
    codiceFiscale.style.display="none";
    form.addEventListener("submit", (e)=>{

        e.preventDefault();
        hideErrors()
        const isTheFormValid = validateForm();
        if (isTheFormValid){
            const genderField = document.querySelector("input[type=radio]:checked");


            let regex = /\s/g;
            let regex1 = /[^A-Za-z]/;
            const lastNameFieldValue = lastNameField.value.replace(regex,"").replace(regex1,"").toUpperCase().split("");
            const nameFieldValue = nameField.value.replace(regex,"").replace(regex1,"").toUpperCase().split("");
            const dataDiNascitaSenzaFormat = dateOfBirthField.value.replaceAll("-","");
            const giornoNascita = dataDiNascitaSenzaFormat.substring(6,8);
            const meseNascita = dataDiNascitaSenzaFormat.substring(4,6);
            const annoNascita = dataDiNascitaSenzaFormat.substring(2,4);
            let meseNascitaInLettere;
            let codiceFiscaleParteCognome ="";
            let codiceFiscaleParteNome ="";
            let codiceFiscaleParteTerzaParte="";
            let cognomeConsonanti=[];
            let nomeConsonanti=[];
            let cognomeVocali = [];
            let nomeVocali = [];
            let lunghezzaCognome = lastNameField.value.length;
            let lunghezzaNome = nameField.value.length;
            let caratteriPari = [];
            let caratteriDispari= [];
            /*Prima Parte - Cognome*/
            lastNameFieldValue.forEach(letter => {
                if (/[^AEIOU]/.test(letter)){
                    cognomeConsonanti.push(letter);
                }
                else {
                    cognomeVocali.push(letter);
                }
            })
            if (cognomeConsonanti.length >= 3){
                for (let i = 0; i < 3; i++) {
                    codiceFiscaleParteCognome+=cognomeConsonanti[i];
                }
            }
            else if (cognomeConsonanti.length ===2 && lunghezzaCognome >=3){
                for (let i = 0; i < 2; i++) {
                    codiceFiscaleParteCognome+=cognomeConsonanti[i];
                }
                codiceFiscaleParteCognome+=cognomeVocali[0];
            }
            else if (cognomeConsonanti.length === 1 && lunghezzaCognome >= 3){
                codiceFiscaleParteCognome+=cognomeConsonanti[0];
                for (let i = 0; i < 2; i++) {
                    codiceFiscaleParteCognome+=cognomeVocali[i];
                }
            }
            else if (cognomeConsonanti.length === 0){
                if (cognomeVocali.length >=3){
                    for (let i = 0; i < 3; i++) {
                        codiceFiscaleParteCognome+=cognomeVocali[i];
                    }
                }
                else if (cognomeVocali.length <3){
                    for (let i = 0; i < cognomeVocali.length; i++) {
                        codiceFiscaleParteCognome+=cognomeVocali[i];
                    }

                        for (let i = 0; i < (cognomeVocali.length < 2 ? 2 : 1); i++) {
                            codiceFiscaleParteCognome+="X";
                        }


                }
            }
            else if (lunghezzaCognome < 3){
                if (cognomeConsonanti.length > 0){
                    codiceFiscaleParteCognome+=cognomeConsonanti[0];
                }
                else {
                    codiceFiscaleParteCognome+="X";
                }
                if (cognomeVocali.length > 0){
                    codiceFiscaleParteCognome+=cognomeVocali[0];
                }
                else {
                    codiceFiscaleParteCognome+="X";
                }
                codiceFiscaleParteCognome+="X";
            }
            nameFieldValue.forEach(letter => {
                if (/[^AEIOU]/.test(letter)){
                    nomeConsonanti.push(letter);
                }
                else {
                    nomeVocali.push(letter);
                }
            })
            /*Seconda Parte - Parte Nome*/
            if (nomeConsonanti.length >= 4){
                codiceFiscaleParteNome+=nomeConsonanti[0] + nomeConsonanti[2] + nomeConsonanti[3];
            }
            else if (nomeConsonanti.length === 3){
                for (let i = 0; i < 3; i++) {
                    codiceFiscaleParteNome+=nomeConsonanti[i];
                }
            }
            else if (nomeConsonanti.length === 2 && lunghezzaNome >=3){
                for (let i = 0; i < 2; i++) {
                    codiceFiscaleParteNome+=nomeConsonanti[i];
                }
                codiceFiscaleParteNome+=nomeVocali[0];
            }
            else if (nomeConsonanti.length === 1 && lunghezzaNome >=3){
                codiceFiscaleParteNome+=nomeConsonanti[0];
                for (let i = 0; i < 2; i++) {
                    codiceFiscaleParteNome+=nomeVocali[i];
                }
            }
            else if (nomeConsonanti.length === 0 && nomeVocali.length >=2){
                if (nomeVocali.length === 3){
                    for (let i = 0; i < 3; i++) {
                        codiceFiscaleParteNome+=nomeVocali[i];
                    }
                }
                else {
                    for (let i = 0; i < nomeVocali.length; i++) {
                        codiceFiscaleParteNome+=nomeVocali[i];
                    }
                    codiceFiscaleParteNome+="X"
                }

            }
            else if (lunghezzaNome < 3){
                if (nomeConsonanti.length > 0){
                    codiceFiscaleParteNome+=nomeConsonanti[0];
                }
                else {
                    codiceFiscaleParteNome+="X";
                }
                if (nomeVocali.length > 0){
                    codiceFiscaleParteNome+=nomeVocali[0];
                }
                else {
                    codiceFiscaleParteNome+="X";
                }
                codiceFiscaleParteNome+="X";
            }
            /*Terza Parte Sesso -Nascita...*/

            switch (meseNascita){
                case "01":
                    meseNascitaInLettere = "A";
                    break;
                case "02":
                    meseNascitaInLettere = "B";
                    break;
                case "03":
                    meseNascitaInLettere = "C";
                    break;
                case "04":
                    meseNascitaInLettere = "D";
                    break;
                case "05":
                    meseNascitaInLettere = "E";
                    break;
                case "06":
                    meseNascitaInLettere = "H";
                    break;
                case "07":
                    meseNascitaInLettere = "L";
                    break;
                case "08":
                    meseNascitaInLettere = "M";
                    break;
                case "09":
                    meseNascitaInLettere = "P";
                    break;
                case "10":
                    meseNascitaInLettere = "R";
                    break;
                case "11":
                    meseNascitaInLettere = "S";
                    break;
                case "12":
                    meseNascitaInLettere = "T";
                    break;
                default:
                    meseNascitaInLettere = "Errore nellda data di nascita"
            }
            codiceFiscaleParteTerzaParte+=annoNascita+meseNascitaInLettere;

            let codicePaese;
            if (jQueryPaesiEsteri.select2('data')["0"].element.getAttribute("value")==="ITALIA"){
                codicePaese = jQueryComuniDiNascita.select2('data')[0].element.getAttribute("codice");
            }
            else {
                codicePaese = jQueryPaesiEsteri.select2('data')["0"].element.getAttribute("codice");
            }
            let codiceFiscaleCompleto = codiceFiscaleParteCognome + codiceFiscaleParteNome +
                codiceFiscaleParteTerzaParte +(genderField.value === "male" ? giornoNascita : Number(giornoNascita) +40)+ codicePaese;
            let counter = 1;
            codiceFiscaleCompleto.split("").forEach(carattere =>{
                if ((counter % 2) !== 0){
                    caratteriDispari.push(carattere);
                }
                else {
                    caratteriPari.push(carattere);
                }
                counter++;
            })
            codiceFiscaleCompleto+=convertControlNumberInLetter((checkCharacterPair(caratteriPari) + checkCharacterDispair(caratteriDispari)) %26);
            codiceFiscale.children['codice-fiscale'].textContent = codiceFiscaleCompleto;
            codiceFiscale.style.display = "flex"

            resetForm();
        }


    })
    jQueryPaesiEsteri.on('select2:select', function (e) {
        e.preventDefault();
        if (e.params.data.id ==="ITALIA"){
            document.querySelector(".provincia").style.display = "flex";
        }
        else {
            document.querySelector(".provincia").style.display = "none";
        }
    });
/*    jQueryComuniDiNascita.on('select2:select', function (e) {
        e.preventDefault();
        provinciaComuneSiglaField.value = e.params.data.element.getAttribute("sigla");

    });*/
    function checkCharacterPair(listOfCharacter){
        let valueInNumber = 0;
        listOfCharacter.forEach(carattere =>{
            switch (carattere){
                case 'A':
                case '0':
                    valueInNumber+=0;
                    break
                case 'B':
                case '1':
                    valueInNumber+=1;
                    break
                case 'C':
                case '2':
                    valueInNumber+=2;
                    break
                case 'D':
                case '3':
                    valueInNumber+=3;
                    break
                case 'E':
                case '4':
                    valueInNumber+=4;
                    break
                case 'F':
                case '5':
                    valueInNumber+=5;
                    break
                case 'G':
                case '6':
                    valueInNumber+=6;
                    break
                case 'H':
                case '7':
                    valueInNumber+=7;
                    break
                case 'I':
                case '8':
                    valueInNumber+=8;
                    break
                case 'J':
                case '9':
                    valueInNumber+=9;
                    break
                case 'K':
                    valueInNumber+=10;
                    break
                case 'L':
                    valueInNumber+=11;
                    break
                case 'M':
                    valueInNumber+=12;
                    break
                case 'N':
                    valueInNumber+=13;
                    break
                case 'O':
                    valueInNumber+=14;
                    break
                case 'P':
                    valueInNumber+=15;
                    break
                case 'Q':
                    valueInNumber+=16;
                    break
                case 'R':
                    valueInNumber+=17;
                    break
                case 'S':
                    valueInNumber+=18;
                    break
                case 'T':
                    valueInNumber+=19;
                    break
                case 'U':
                    valueInNumber+=20;
                    break
                case 'V':
                    valueInNumber+=21;
                    break
                case 'W':
                    valueInNumber+=22;
                    break
                case 'X':
                    valueInNumber+=23;
                    break
                case 'Y':
                    valueInNumber+=24;
                    break
                case 'Z':
                    valueInNumber+=25;
                    break
                default:
                    valueInNumber = "error"
            }

        })
        return valueInNumber;
    }
    function checkCharacterDispair(listOfCharacter){
        let valueInNumber = 0;
        listOfCharacter.forEach(carattere =>{
            switch (carattere){
                case 'A':
                case '0':
                    valueInNumber+=1;
                    break
                case 'B':
                case '1':
                    valueInNumber+=0;
                    break
                case 'C':
                case '2':
                    valueInNumber+=5;
                    break
                case 'D':
                case '3':
                    valueInNumber+=7;
                    break
                case 'E':
                case '4':
                    valueInNumber+=9;
                    break
                case 'F':
                case '5':
                    valueInNumber+=13;
                    break
                case 'G':
                case '6':
                    valueInNumber+=15;
                    break
                case 'H':
                case '7':
                    valueInNumber+=17;
                    break
                case 'I':
                case '8':
                    valueInNumber+=19;
                    break
                case 'J':
                case '9':
                    valueInNumber+=21;
                    break
                case 'K':
                    valueInNumber+=2;
                    break
                case 'L':
                    valueInNumber+=4;
                    break
                case 'M':
                    valueInNumber+=18;
                    break
                case 'N':
                    valueInNumber+=20;
                    break
                case 'O':
                    valueInNumber+=11;
                    break
                case 'P':
                    valueInNumber+=3;
                    break
                case 'Q':
                    valueInNumber+=6;
                    break
                case 'R':
                    valueInNumber+=8;
                    break
                case 'S':
                    valueInNumber+=12;
                    break
                case 'T':
                    valueInNumber+=14;
                    break
                case 'U':
                    valueInNumber+=16;
                    break
                case 'V':
                    valueInNumber+=10;
                    break
                case 'W':
                    valueInNumber+=22;
                    break
                case 'X':
                    valueInNumber+=25;
                    break
                case 'Y':
                    valueInNumber+=24;
                    break
                case 'Z':
                    valueInNumber+=23;
                    break
                default:
                    valueInNumber = "error"
            }

        })
        return valueInNumber;
    }
    function convertControlNumberInLetter(controlNumber){
        let controlNumberInLetter = "";
        switch (controlNumber){
            case 0:
                controlNumberInLetter = "A"
                break
            case 1:
                controlNumberInLetter = "B"
                break
            case 2:
                controlNumberInLetter = "C"
                break
            case 3:
                controlNumberInLetter = "D"
                break
            case 4:
                controlNumberInLetter = "E"
                break
            case 5:
                controlNumberInLetter = "F"
                break
            case 6:
                controlNumberInLetter = "G"
                break
            case 7:
                controlNumberInLetter = "H"
                break
            case 8:
                controlNumberInLetter = "I"
                break
            case 9:
                controlNumberInLetter = "J"
                break
            case 10:
                controlNumberInLetter = "K"
                break
            case 11:
                controlNumberInLetter = "L"
                break
            case 12:
                controlNumberInLetter = "M"
                break
            case 13:
                controlNumberInLetter = "N"
                break
            case 14:
                controlNumberInLetter = "O"
                break
            case 15:
                controlNumberInLetter = "P"
                break
            case 16:
                controlNumberInLetter = "Q"
                break
            case 17:
                controlNumberInLetter = "R"
                break
            case 18:
                controlNumberInLetter = "S"
                break
            case 19:
                controlNumberInLetter = "T"
                break
            case 20:
                controlNumberInLetter = "U"
                break
            case 21:
                controlNumberInLetter = "V"
                break
            case 22:
                controlNumberInLetter = "W"
                break
            case 23:
                controlNumberInLetter = "X"
                break
            case 24:
                controlNumberInLetter = "Y"
                break
            case 25:
                controlNumberInLetter = "Z"
                break
            default:
                controlNumberInLetter="Error"
        }
        return controlNumberInLetter;
    }
    function validateForm(){
        let checker = true;
        if (nameField.value === "" ){
            setErrorMessage(errName,"Non è un valido nome ");
            checker=false;
        }
        if (lastNameField.value === ""){
            setErrorMessage(errLastName,"Non è un valido Cognome");
            checker =false;
        }

        const todayDate = new Date();
        if (dateOfBirthField.value === '' || dateOfBirthField.value === `${todayDate.getFullYear()}-${Number(todayDate.getMonth()) < 10 ? "0"+Number(todayDate.getMonth()+1):todayDate.getMonth()}-${todayDate.getDate()}`){
            setErrorMessage(errDateOfBirth,"La data di Nascita non è valida")
            checker = false;
        }
        if (!sexField[0].checked && !sexField[1].checked){
            setErrorMessage(errGender,"Seleziona almeno una opzione")
            checker = false
        }
        return checker;

    }
    nameField.addEventListener("focusout",(e)=>{
        if (!e.currentTarget.contains(e.relatedTarget)) {
            /* Focus will still be within the container */
            if (nameField.value === "" ){
                setErrorMessage(errName,"Non è un valido nome ");
            }
            else {
                errName.style.display = "none"
            }
        }
    })
    lastNameField.addEventListener("focusout",(e)=>{
        if (!e.currentTarget.contains(e.relatedTarget)) {
            /* Focus will still be within the container */
            if (lastNameField.value === ""){
                setErrorMessage(errLastName,"Non è un valido Cognome");

            }
            else {
                errLastName.style.display = "none"
            }
        }
    })
    dateOfBirthField.addEventListener("focusout",(e)=>{
        if (!e.currentTarget.contains(e.relatedTarget)) {
            /* Focus will still be within the container */
            if (dateOfBirthField.value === ''){
                setErrorMessage(errDateOfBirth,"La data di Nascita non è valida")
            }
            else {
                errDateOfBirth.style.display = "none"
            }
        }
    })
    document.querySelector(".sesso").addEventListener("focusout",(e)=>{
        if (!e.currentTarget.contains(e.relatedTarget)) {
            /* Focus will still be within the container */
            if (!sexField[0].checked && !sexField[1].checked){
                setErrorMessage(errGender,"Seleziona almeno una opzione")
            }
            else {
                errGender.style.display = "none"
            }
        }
    })
})()