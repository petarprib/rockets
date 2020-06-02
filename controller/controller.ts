let rockets: Rocket[] = [];
let rocket: Rocket;
let thruster: Thruster;

let submitRocket = () => {
    let name: string = (<HTMLInputElement>document.getElementById("name")).value;
    let thrustersNum: number = parseInt((<HTMLInputElement>document.getElementById("thrusters-num")).value);
    let nameErrorDisplay: HTMLElement = document.getElementById("name-error");
    let thrustersErrorDisplay: HTMLElement = document.getElementById("thrusters-error");
    let pointsLeft: HTMLElement = document.getElementById("points-left");
    let submitRocket: HTMLElement = document.getElementById("submit-rocket");
    let showPower: HTMLElement = document.getElementById("show-power");

    let duplicates = 0;
    for (let i = 0; i < rockets.length; i++) {
        if (rockets[i].name === name) {
            duplicates += 1;
            nameErrorDisplay.classList.remove("d-none");
            return false;
        } else {
            nameErrorDisplay.classList.add("d-none");
        }
    }

    let thrustersError = 0;
    if (thrustersNum < 1 || thrustersNum > 6) {
        thrustersError += 1;
        thrustersErrorDisplay.classList.remove("d-none");
    } else {
        thrustersErrorDisplay.classList.add("d-none");
    }

    if (duplicates === 0 && thrustersError === 0) {
        rocket = new Rocket(name, thrustersNum);
        nameErrorDisplay.classList.add("d-none");
        thrustersErrorDisplay.classList.add("d-none");
        submitRocket.classList.add("d-none");
        pointsLeft.classList.remove("d-none");
        showPower.classList.add("form-group");
        for (let i = 1; i < thrustersNum + 1; i++) {
            showPower.insertAdjacentHTML('beforeend', ` <div class="col">
                                                            <label for="power${i}">T${i}</label>
                                                            <input id="power${i}" class="form-control" type="number" value="0" min="0" max="120" step="10" onchange="changePoints()">
                                                            <small id="power-error-${i}" class="text-danger d-none">The thruster needs to have a positive value in jumps of 10</small>
                                                        </div>`);
        }
    }
}

let addThrusters = () => {
    let submitRocket: HTMLElement = document.getElementById("submit-rocket");
    let pointsLeft: HTMLElement = document.getElementById("points-left");
    let showPower: HTMLElement = document.getElementById("show-power");
    let addThrusters: HTMLElement = document.getElementById("add-thrusters");
    let showRockets: HTMLElement = document.getElementById("show-rockets");

    let errors: number = 0;
    for (let i = 1; i < rocket.thrustersNum + 1; i++) {
        let powerI = parseInt((<HTMLInputElement>document.getElementById(`power${i}`)).value);
        let powerError: HTMLElement = document.getElementById(`power-error-${i}`);
        if (powerI === 0 || powerI.toString().charAt(powerI.toString().length - 1) !== "0") {
            errors += 1;
            powerError.classList.remove("d-none");
        } else if (powerI >= 10) {
            powerError.classList.add("d-none");
        }
    }

    if (errors === 0) {
        for (let i = 1; i < rocket.thrustersNum + 1; i++) {
            let powerI = parseInt((<HTMLInputElement>document.getElementById(`power${i}`)).value);
            thruster = new Thruster(powerI);
            rocket.addThruster(thruster);
        }
        rockets.push(rocket);

        let maxPower: number[] = new Array();
        let currentPower: number[] = new Array();
        for (let i = 0; i < rocket.thrusters.length; i++) {
            maxPower.push(rocket.thrusters[i].maxPower);
            currentPower.push(rocket.thrusters[i].currentPower);
        }
        showRockets.insertAdjacentHTML('beforeend', `   <div class="row mb-3">
                                                            <div class="col">
                                                                <div>
                                                                    <p class="mb-0">${rocket.name} - Max power: ${maxPower.join(", ")}</p>
                                                                </div>
                                                                <div>
                                                                    <p id="rocket${rockets.length - 1}" class="mb-0">Current power: ${currentPower.join(", ")}</p>
                                                                </div>
                                                            </div>
                                                            <div class="col my-auto">     
                                                                <button class="btn btn-light" onclick="accelRocket(${rockets.length - 1})">Accelerate</button>
                                                                <button class="btn btn-light" onclick="decelRocket(${rockets.length - 1})">Decelerate</button>
                                                            </div>
                                                        </div>`);

        (<HTMLInputElement>document.getElementById("name")).value = "";
        (<HTMLInputElement>document.getElementById("thrusters-num")).value = "1";
        submitRocket.classList.remove("d-none");
        pointsLeft.classList.add("d-none");
        showPower.classList.remove("form-group");
        showPower.innerHTML = "";
        addThrusters.classList.add("d-none");
    }
}

let changePoints = () => {
    let pointsLeft: HTMLElement = document.getElementById("points-left");
    let addThrusters: HTMLElement = document.getElementById("add-thrusters");
    let sumOfValues: number = 0;

    for (let i = 1; i < rocket.thrustersNum + 1; i++) {
        let thrusterIndexValue: number = parseInt((<HTMLInputElement>document.getElementById(`power${i}`)).value);
        sumOfValues += thrusterIndexValue;
    }

    let points: number = 120 - sumOfValues;
    for (let i = 1; i < rocket.thrustersNum + 1; i++) {
        let thrusterIndex = (<HTMLInputElement>document.getElementById(`power${i}`));
        let newMax: number = parseInt(thrusterIndex.value) + points;
        thrusterIndex.max = newMax.toString();
        pointsLeft.innerHTML = `Points left: ${points}`;
    }

    if (points === 0) {
        addThrusters.classList.remove("d-none");
    } else {
        addThrusters.classList.add("d-none");
    }
}

let accelRocket = (rocketIndex: number) => {
    let displayPower: HTMLElement = document.getElementById(`rocket${rocketIndex}`);
    let rocket = rockets[rocketIndex];
    let currentPower: number[] = [];
    for (let i = 0; i < rocket.thrustersNum; i++) {
        if (rocket.thrusters[i].currentPower < rocket.thrusters[i].maxPower) {
            rocket.thrusters[i].currentPower += 10;
        }
        currentPower.push(rocket.thrusters[i].currentPower);
    }
    displayPower.innerHTML = `Current power: ${currentPower.join(", ")}`;
}

let decelRocket = (rocketIndex: number) => {
    let displayPower: HTMLElement = document.getElementById(`rocket${rocketIndex}`);
    let rocket = rockets[rocketIndex];
    let currentPower: number[] = [];
    for (let i = 0; i < rocket.thrustersNum; i++) {
        if (rocket.thrusters[i].currentPower > 0) {
            rocket.thrusters[i].currentPower -= 10;
        }
        currentPower.push(rocket.thrusters[i].currentPower);
    }
    displayPower.innerHTML = `Current power: ${currentPower.join(", ")}`;
}