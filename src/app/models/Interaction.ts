export class Interaction {
    sex: Number;
    age: Number;
    salary: Number;
    skill: Number;
    year_of_arrival: Number;
    agent_ID: Number;
    satisfaction: Number;

    constructor(sex: Number, age: Number, salary: Number, skill: Number, year_of_arrival: Number, agent_ID: Number, satisfaction: Number){
        this.sex = sex;
        this.age = age;
        this.salary = salary;
        this.skill = skill;
        this.year_of_arrival = year_of_arrival;
        this.agent_ID = agent_ID;
        this.satisfaction = satisfaction;
    }
  }