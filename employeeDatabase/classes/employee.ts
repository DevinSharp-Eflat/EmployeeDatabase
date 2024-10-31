/*constructor should have:
a first name
a last name
a role (provide a list of available)
a manager (provide a list of available)
*/

import { Role } from "./role";

export class Employee {
    firstName: string;
    lastName: string;
    role: Role;
    manager?: Employee;
    
    constructor(first: string, last: string, role: Role, manager: Employee) {
        this.firstName = first;
        this.lastName = last;
        this.role = role;
        this.manager = manager;
    }
}