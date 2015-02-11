
// Regex pattern to validate SSN
var patternSSN = /^[0-9]{3}[\- ]?[0-9]{2}[\- ]?[0-9]{4}$/;
// Regex pattern to validate Phone Number
var phoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
// Regex pattern to validate Credit Card Number
var creditCard = /^((4\d{3})|(5[1-5]\d{2})|(6011)|(3[68]\d{2})|(30[012345]\d))[ -]?(\d{4})[ -]?(\d{4})[ -]?(\d{4}|3[4,7]\d{13})$/;
// Regex pattern to validate Email ID
var emailID = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Password strength
var friendlyPercentage = 0;
// Custom Alert Dialog
var Alert = new CustomAlert();
// Status of Registration
var status = 0;
// Random Color for Human Validation
var color = "";

var src = document.getElementById("src");
var target = document.getElementById("target");
var msg = document.getElementById("msg");
var draggedID;
target.ondragenter = handleDrag;
target.ondragover = handleDrag;

target.ondrop = function(e) {
var newElem = document.getElementById(draggedID).cloneNode(false);
target.innerHTML = "";
target.appendChild(newElem);
e.preventDefault();
}

function handleDrag(e) {
e.preventDefault();
}

src.ondragstart = function(e) {
draggedID = e.target.id;
e.target.classList.add("dragged");
}

src.ondragend = function(e) {
var elems = document.querySelectorAll(".dragged");
for (var i = 0; i < elems.length; i++) {
elems[i].classList.remove("dragged");
}

if(color.localeCompare(e.target.id) == 0){
  document.getElementById("submit_form").disabled = false;
}else{
    document.getElementById("submit_form").disabled = true;
}

}

// Method to submit user details by validating User Details
function submitFormDetails(){
    
    // Validate User Details
    
    if(isLocalStorageSupported()){
      if(isValidEmail()){    
        if(isValidSSN()){
          if(isPhoneNumberFormatValid()){
            if(isValidCreditCardNumber()){
               if(isNetworkConnectionAvailable()){
                addUser();
                Alert.render('Thanks '+document.getElementById('fname').value+'. '+'You are successfully registered...');
               }else{
                Alert.render('Your browser is working offline. Hence data saved locally!!!');
                saveToLocalStorage();
               }  
            }else{
              Alert.render('Invalid Credit Card Number...');
            }

          }else{
            Alert.render('Invalid Phone Number...');
          }

        }else{
          Alert.render('Invalid SSN...');
        }
      }else{
        Alert.render('Invalid Email ID...');   
      }       
    }else{
     Alert.render('Local Storage not supported....');
    }   

}

// Method to check if Internet connection is available
function isNetworkConnectionAvailable(){
    if(navigator.onLine)
        return true;
    else
        return false;
}

//Method called when your browser is working online
function onLineMethod() {
    Alert.render('Your browser is working online.');
}

//Method called when your browser is working offline
function offLineMethod() {
    Alert.render('Your browser is working offline. Please check your Internet connection!!!');
}


// Method that prepares User object with User details and converts it to a JSON String
function toJSONString(){

    var User = {
    firstName : document.getElementById('fname').value,
    lastName  : document.getElementById('lname').value,
    emailID       : document.getElementById('email').value,
    password  : document.getElementById('password').value,
    passwordStrength : friendlyPercentage,
    dob  : document.getElementById('dob').value,
    dobWithTime  : document.getElementById('dobtime').value,
    localDOB  : document.getElementById('local_dob').value,
    ssn  : document.getElementById('ssn').value,
    phone  : document.getElementById('phone').value,
    creditCardNumber  : document.getElementById('cc').value
    };

    var objectJSONString = JSON.stringify(User);

    return objectJSONString;   
}

// Method that reads the data from JSON String and loads the registration Object
function readFromJSONString(userObjectJSONRead){

    return JSON.parse(userObjectJSONRead);

}

// Make AJAX Call and send User object JSON to the backend and store it in Database
function addUser(){

    var userInfo = toJSONString();

    clearForm();
    
    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: userInfo,
        url: '/users',
        dataType: 'JSON'
    }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {


                Alert.render('Thanks '+document.getElementById('fname').value+'. '+'You are successfully registered...');

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                Alert.render('Error: ' + response.msg);

            }
        });
}

// Save JSON String of User Object to Local Storage  
function saveToLocalStorage(){

    // Store JSON String of User Object to Local Storage
    sessionStorage.userObject = toJSONString();

    saveToSessionStorage();  
}

// Save JSON String of User Object to Session Storage
function saveToSessionStorage(){

    // Store JSON String of User Object to Local Storage
    localStorage.userObject = toJSONString();
    status = 1;
}

// Method to Read User Object JSON String from Local Storage
function readFromLocalStorage(){

    var userObjectJSONRead = localStorage.userObject;

    var userOBJ = readFromJSONString(userObjectJSONRead);

    fillFormElements(userOBJ);

}

// Method to Read User Object JSON String from Session Storage
function readFromSessionStorage(){

    var userObjectJSONRead = sessionStorage.userObject;

    var userOBJ = readFromJSONString(userObjectJSONRead);

    fillFormElements(userOBJ);

}

// Populate Registration Form with User Object details
function fillFormElements(userOBJ){
    document.getElementById('fname').value = userOBJ.firstName;
    document.getElementById('lname').value = userOBJ.lastName;
    document.getElementById('email').value = userOBJ.emailID;
    document.getElementById('password').value = userOBJ.password;
    CkPW(userOBJ.password);
    document.getElementById('confirm_password').value = userOBJ.password;
    document.getElementById('dob').value = userOBJ.dob;
    document.getElementById('dobtime').value = userOBJ.dobWithTime;
    document.getElementById('local_dob').value = userOBJ.localDOB;
    document.getElementById('ssn').value = userOBJ.ssn;
    document.getElementById('phone').value = userOBJ.phone;
    document.getElementById('cc').value = userOBJ.creditCardNumber;
}

// Method to check if local storage is supported
function isLocalStorageSupported(){
if (Modernizr.localstorage)
  // window.localStorage is available
  return true;
else 
  return false;
  // no native support for HTML5 storage
}

// Method to check if valid SSN
function isValidSSN(){
var ssn = document.getElementById('ssn').value;
    if (patternSSN.test(ssn)) {
        return true;
    } else {
        return false;
    }
}

// Method to check if Valid Phone Number
function isPhoneNumberFormatValid(){
var phoneNumber = document.getElementById('phone').value; 
if (phoneNo.test(phoneNumber)) {
        return true;
    } else {
        return false;
    }
}

// Method to check if valid Credit Card Number
function isValidCreditCardNumber(){
var creditCardNumber = document.getElementById('cc').value; 
if (creditCard.test(creditCardNumber)) {
        return true;
    } else {
        return false;
    }
}

// Method to check if valid Email ID
function isValidEmail(){
    var email = document.getElementById('email').value; 
    if (emailID.test(email)) {
        return true;
    } else {
        return false;
    }
}

// Method to clear Form
function clearForm(){
    document.getElementById("registrationForm").reset();
    CkPW("");
}

function getHumanValidationColor(){
    document.getElementById("submit_form").disabled = true;

    var colorArray = [
    'Red',
    'Green',
    'Yellow'
];
var randomColor = Math.floor(Math.random()*colorArray.length);
color = colorArray[randomColor];
document.getElementById('msg').innerHTML = "Drop Here" ;
document.getElementById('info').innerHTML = "Drag and Drop "+ color+" Color." ;
}


<!--
// Begin Password Strength Validator
// == This Script Free To Use Providing This Notice Remains == //
// == This Script Has Been Found In The http://SnapBuilder.com Free Public Codes Library == //
// == NOTICE: Though This Material May Have Been In A Public Depository, Certain Author Copyright Restrictions May Apply == //
// == Created by: CSGNetwork : http://www.CSGNetwork.com : Creative Commons License == //
var minimum = ""; // can set and code for this if desired
var maximum = ""; // can set and code for this if desired
var ComPWs = new Array('password', 'pass', '1234', '1246', '123456', '1357', 'childname', 'spousename', 'dogname', 'birthday', 'address', 'anniversary', 'weddingdate', 'carname'); // these are a few literal examples. This can be large and a second external group, such as a dictionary should also be used.
var digits = "0123456789"; // change as needed - match below
var lcchrs = "abcdefghijklmnopqrstuvwxyz"; // change as needed - match below
var ucchrs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // change as needed - match below
var puncchrs = "!.?,;:`"; // don't use " or ' here. change as needed - match below
var specchrs = "@$Â£#*()%~<>{}[]+-_|\/^&"; // don't use " or ' here. do not duplicate characters in puncchrs. change as needed - match below
var space = " "; // ASCII 32; may or may not be valid in pws. change as needed - match below
// or could use as an alternate
//var space = (String.fromCharCode(32)); // ASCII 32; may or may not be valid in pws. change as needed - match below
var sq = (String.fromCharCode(39)); // single quote ASCII 39; may or may not be valid in pws. change as needed - match below
var dq = (String.fromCharCode(34)); // double quote ASCII 34; may or may not be valid in pws. change as needed - match below
function CkPW(password) {
        var combinations = 0;
        if (contains(password, digits) > 0) {
                combinations += 10;
        }
        if (contains(password, lcchrs) > 0) {
                combinations += 26;
        }
        if (contains(password, ucchrs) > 0) {
                combinations += 26;
        }
        if (contains(password, puncchrs) > 0) {
                combinations += puncchrs.length;
        }
        if (contains(password, specchrs) > 0) {
                combinations += specchrs.length;
        }
        if (contains(password, space) > 0) {
                combinations += 1;
        }
        if (contains(password, sq) > 0) {
                combinations += 1;
        }
        if (contains(password, dq) > 0) {
                combinations += 1;
        }
        // work out the total combinations
        var totalCombinations = Math.pow(combinations, password.length);
        // if the password is a common password, then everthing changes...
        // this is the "shortlist"; test long list if available 75K or >
        if (isCommonPassword(password)) {
                totalCombinations = 75000;
                // about the size of the preferred dictionary; read in correct value from list or group
        }
        // work out how long it would take to crack this (@ 200 attempts per second)
        var timeInSeconds = (totalCombinations / 200) / 2;
        // this is how many days? (there are 86,400 seconds in a day.)
        var timeInDays = timeInSeconds / 86400
        // how long we want it to last
        var lifetime = 365;
        // how close is the time to the projected time?
        var percentage = timeInDays / lifetime;
        friendlyPercentage = cap(Math.round(percentage * 100), 100);
        if (totalCombinations != 75000 && friendlyPercentage < (password.length * 5)) {
                friendlyPercentage += password.length * 5;
        }
        var progressBar = document.getElementById("progressBar");
        progressBar.style.width = friendlyPercentage + "%";
        if (percentage > 1) {
                // strong password
                progressBar.style.backgroundColor = "#3bce08";
                return;
        }
        if (percentage > 0.5) {
                // reasonable password
                progressBar.style.backgroundColor = "#ffd801";
                return;
        }
        if (percentage > 0.10) {
                // weak password
                progressBar.style.backgroundColor = "orange";
                return;
        }
        // dangerous password!
        if (percentage <= 0.10) {
                // weak password
                progressBar.style.backgroundColor = "red";
                return;
        }
}
function cap(number, max) {
        if (number > max) {
                return max;
        } else {
                return number;
        }
}
function isCommonPassword(password) {
        // will define as white background; less than desirable in most cases
        // however, if it just contains it, let it go as the number of characters
        for (i = 0; i < ComPWs.length; i++) {
                var commonPassword = ComPWs[i];
                if (password == commonPassword) {
                        return true;
                }
        }
        return false;
}
function contains(password, validChars) {
        count = 0;
        // possible good with 5 chrs if include 1 from 3 different groups
        // at least 7 if only 1 group for caution, 8 for good
        for (i = 0; i < password.length; i++) {
                var char = password.charAt(i);
                if (validChars.indexOf(char) > -1) {
                        count++;
                        // build minimum and maximum routines here if desired
                        // as is, unneeded
                }
        }
        return count;
}

// Method that prepares custom Alert Box
function CustomAlert(){
    this.render = function(dialog){
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH+"px";
        dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = "Information:";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<button class="btn btn-primary" onclick="Alert.ok()">OK</button>';
    }
    this.ok = function(){
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        if(status==1){  
          status = 0;
          clearForm();    
        }
    }
}

//-->