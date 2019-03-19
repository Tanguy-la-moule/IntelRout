import { Interaction } from './Interaction';

export class Simulation {
    id: number;
    date: string;
    name: string;
    interactions: Array<Interaction> = new Array<Interaction>();

    constructor(id: number, date: string, name: string, interactions: Array<Interaction>){
        if (id > 0){
            this.id = id;
            this.date = date;
            this.name = name;
            for (var interaction of interactions){
                this.interactions.push(new Interaction(interaction.sex, interaction.age, interaction.salary, interaction.skill, interaction.year_of_arrival, interaction.agent_ID, interaction.satisfaction));
            }
        } else {
            this.id = parseInt(localStorage.getItem('id')) + 1;
            console.log('updated id to '+ (this.id + 1))
            localStorage.setItem('id', (this.id).toString());
            this.date = new Date().toLocaleDateString('en-US');
            (name.length == 0) ? this.name = 'Untitled ' + (this.date) : this.name = name;
        }
    }

    addInteraction(interaction: Interaction): void{
        this.interactions.push(interaction);
    }

    removeInteraction(id: number){
        this.interactions.splice(id, 1);
    }
}