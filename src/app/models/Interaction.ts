export class Interaction {
    sex: boolean;
    age: Number;
    salary: Number;
    skill: Number;
    year_of_arrival: Number;
    agent: Number;
    satisfaction: Number;

    constructor(sex: boolean, age: Number, salary: Number, skill: Number, year_of_arrival: Number, agent: Number, satisfaction: Number){
        this.sex = sex;
        this.age = age;
        this.salary = salary;
        this.skill = skill;
        this.year_of_arrival = year_of_arrival;
        this.agent = agent;
        this.satisfaction = satisfaction;
    }
  }