/*constructor should ask for: 
a name 
a salary
a department to belong to (provide a list)
*/
import { Department } from './department'

export class Role {
    name: string;
    salary: number;
    department: Department;

    constructor(name: string, salary: number, department: Department){
        this.name = name;
        this.salary = salary;
        this.department = department;
    }
}