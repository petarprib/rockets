"use strict";
var Rocket = /** @class */ (function () {
    function Rocket(name, thrustersNum) {
        this.thrusters = new Array();
        this.name = name;
        this.thrustersNum = thrustersNum;
    }
    Rocket.prototype.addThruster = function (thruster) {
        this.thrusters.push(thruster);
    };
    return Rocket;
}());
