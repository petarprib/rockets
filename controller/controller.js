"use strict";
var rockets = [];
var rocket;
var thruster;
var submitRocket = function () {
    var name = document.getElementById("name").value;
    var thrustersNum = parseInt(document.getElementById("thrusters-num").value);
    var nameErrorDisplay = document.getElementById("name-error");
    var thrustersErrorDisplay = document.getElementById("thrusters-error");
    var pointsLeft = document.getElementById("points-left");
    var submitRocket = document.getElementById("submit-rocket");
    var showPower = document.getElementById("show-power");
    var duplicates = 0;
    for (var i = 0; i < rockets.length; i++) {
        if (rockets[i].name === name) {
            duplicates += 1;
            nameErrorDisplay.classList.remove("d-none");
            return false;
        }
        else {
            nameErrorDisplay.classList.add("d-none");
        }
    }
    var thrustersError = 0;
    if (thrustersNum < 1 || thrustersNum > 6) {
        thrustersError += 1;
        thrustersErrorDisplay.classList.remove("d-none");
    }
    else {
        thrustersErrorDisplay.classList.add("d-none");
    }
    if (duplicates === 0 && thrustersError === 0) {
        rocket = new Rocket(name, thrustersNum);
        nameErrorDisplay.classList.add("d-none");
        thrustersErrorDisplay.classList.add("d-none");
        submitRocket.classList.add("d-none");
        pointsLeft.classList.remove("d-none");
        showPower.classList.add("form-group");
        for (var i = 1; i < thrustersNum + 1; i++) {
            showPower.insertAdjacentHTML('beforeend', " <div class=\"col\">\n                                                            <label for=\"power" + i + "\">T" + i + "</label>\n                                                            <input id=\"power" + i + "\" class=\"form-control\" type=\"number\" value=\"0\" min=\"0\" max=\"120\" step=\"10\" onchange=\"changePoints()\">\n                                                            <small id=\"power-error-" + i + "\" class=\"text-danger d-none\">The thruster needs to have a positive value in jumps of 10</small>\n                                                        </div>");
        }
    }
};
var addThrusters = function () {
    var submitRocket = document.getElementById("submit-rocket");
    var pointsLeft = document.getElementById("points-left");
    var showPower = document.getElementById("show-power");
    var addThrusters = document.getElementById("add-thrusters");
    var showRockets = document.getElementById("show-rockets");
    var errors = 0;
    for (var i = 1; i < rocket.thrustersNum + 1; i++) {
        var powerI = parseInt(document.getElementById("power" + i).value);
        var powerError = document.getElementById("power-error-" + i);
        if (powerI === 0 || powerI.toString().charAt(powerI.toString().length - 1) !== "0") {
            errors += 1;
            powerError.classList.remove("d-none");
        }
        else if (powerI >= 10) {
            powerError.classList.add("d-none");
        }
    }
    if (errors === 0) {
        for (var i = 1; i < rocket.thrustersNum + 1; i++) {
            var powerI = parseInt(document.getElementById("power" + i).value);
            thruster = new Thruster(powerI);
            rocket.addThruster(thruster);
        }
        rockets.push(rocket);
        var maxPower = new Array();
        var currentPower = new Array();
        for (var i = 0; i < rocket.thrusters.length; i++) {
            maxPower.push(rocket.thrusters[i].maxPower);
            currentPower.push(rocket.thrusters[i].currentPower);
        }
        showRockets.insertAdjacentHTML('beforeend', "   <div class=\"row mb-3\">\n                                                            <div class=\"col\">\n                                                                <div>\n                                                                    <p class=\"mb-0\">" + rocket.name + " - Max power: " + maxPower.join(", ") + "</p>\n                                                                </div>\n                                                                <div>\n                                                                    <p id=\"rocket" + (rockets.length - 1) + "\" class=\"mb-0\">Current power: " + currentPower.join(", ") + "</p>\n                                                                </div>\n                                                            </div>\n                                                            <div class=\"col my-auto\">     \n                                                                <button class=\"btn btn-light\" onclick=\"accelRocket(" + (rockets.length - 1) + ")\">Accelerate</button>\n                                                                <button class=\"btn btn-light\" onclick=\"decelRocket(" + (rockets.length - 1) + ")\">Decelerate</button>\n                                                            </div>\n                                                        </div>");
        document.getElementById("name").value = "";
        document.getElementById("thrusters-num").value = "1";
        submitRocket.classList.remove("d-none");
        pointsLeft.classList.add("d-none");
        showPower.classList.remove("form-group");
        showPower.innerHTML = "";
        addThrusters.classList.add("d-none");
    }
};
var changePoints = function () {
    var pointsLeft = document.getElementById("points-left");
    var addThrusters = document.getElementById("add-thrusters");
    var sumOfValues = 0;
    for (var i = 1; i < rocket.thrustersNum + 1; i++) {
        var thrusterIndexValue = parseInt(document.getElementById("power" + i).value);
        sumOfValues += thrusterIndexValue;
    }
    var points = 120 - sumOfValues;
    for (var i = 1; i < rocket.thrustersNum + 1; i++) {
        var thrusterIndex = document.getElementById("power" + i);
        var newMax = parseInt(thrusterIndex.value) + points;
        thrusterIndex.max = newMax.toString();
        pointsLeft.innerHTML = "Points left: " + points;
    }
    if (points === 0) {
        addThrusters.classList.remove("d-none");
    }
    else {
        addThrusters.classList.add("d-none");
    }
};
var accelRocket = function (rocketIndex) {
    var displayPower = document.getElementById("rocket" + rocketIndex);
    var rocket = rockets[rocketIndex];
    var currentPower = [];
    for (var i = 0; i < rocket.thrustersNum; i++) {
        if (rocket.thrusters[i].currentPower < rocket.thrusters[i].maxPower) {
            rocket.thrusters[i].currentPower += 10;
        }
        currentPower.push(rocket.thrusters[i].currentPower);
    }
    displayPower.innerHTML = "Current power: " + currentPower.join(", ");
};
var decelRocket = function (rocketIndex) {
    var displayPower = document.getElementById("rocket" + rocketIndex);
    var rocket = rockets[rocketIndex];
    var currentPower = [];
    for (var i = 0; i < rocket.thrustersNum; i++) {
        if (rocket.thrusters[i].currentPower > 0) {
            rocket.thrusters[i].currentPower -= 10;
        }
        currentPower.push(rocket.thrusters[i].currentPower);
    }
    displayPower.innerHTML = "Current power: " + currentPower.join(", ");
};
