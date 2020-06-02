class Rocket {
    name: string;
    thrustersNum: number;
    thrusters: Thruster[] = new Array();

    constructor(name: string, thrustersNum: number) {
        this.name = name;
        this.thrustersNum = thrustersNum;
    }

    addThruster(thruster: Thruster): void {
        this.thrusters.push(thruster);
    }
}