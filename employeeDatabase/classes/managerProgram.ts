import inquirer from "inquirer";
//create a class with functions allowing the user to interact via inquirer and then export the whole class
import { Role } from "./role";
import { Employee } from "./employee";
import { Department } from "./department";
import { Database } from 'sqlite3';
import fs from 'fs';
import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from '../connections.ts';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

class ManagerProgram {


    async viewAllEmployees() {
        // const fetchData = await fetch('/api/employee');
        // const results = (fetchData).json();
        // console.log(results);
        // this.userInput();
        const sql = 
        "SELECT employee.employeeId, employee.firstName, employee.lastName, roles.roleTitle, department.departmentName, employee.managerId AS manager FROM employee INNER JOIN roles ON employee.employeeRole = roles.roleId INNER JOIN department ON roles.roleDepartment = department.departmentId ORDER BY employeeId";
        const res = await pool.query(sql);
        console.table(res.rows);
        this.userInput();
    }

    async viewAllRoles() {
        const sql = 'SELECT * FROM roles';
        const res = await pool.query(sql);
        console.table(res.rows);
        this.userInput();
    }

    async viewAllDepartments() {
        const sql = 'SELECT * FROM department';
        const res = await pool.query(sql);
        console.table(res.rows);
        this.userInput();
    }

    async addEmployee() {
        // const fetchRoles = await fetch('/api/role');
        // const roleData = fetchRoles.json();
        // const fetchEmployees =  await fetch('/api/employee');
        const sqlEmp = await pool.query('SELECT * FROM employee');
        const employeeRes = sqlEmp.rows;
        const sqlRole = await pool.query('SELECT * FROM roles');
        const roleRes = sqlRole.rows;

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is their first name?',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is their last name?',
                },
                {
                    type: 'list',
                    name: 'Role',
                    message: 'What is their role?',
                    choices: roleRes.map((x) => {
                        return {
                            name: `${x.roletitle}`,
                            value: x.roleid,
                        };
                    })
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is their manager?',
                    choices: employeeRes.map((x) => {
                        return {
                            name: `${x.firstname} ${x.lastname}`,
                            value: x.employeeid,
                        }
                    })
                },
            ]) 
                .then(async (answers) => {
                    console.log(answers.manager)
                    const newEmp = new Employee( answers.firstName, answers.lastName, answers.Role, answers.manager);
                    const insertSQL = `INSERT INTO employee (firstName, lastName, employeeRole, managerId) VALUES ($1, $2, $3, $4)`;
                    
                    //get Role ID for Role name selected
                    //const rIDsql = await pool.query(`SELECT * FROM roles WHERE roleTitle = $1`, [answers.Role]);
                    //const mIDsql = await pool.query(`SELECT * FROM employee WHERE firstName = $1, lastName = $2`, [answers.manager.firstName, answers.manager.lastName]);
                    //const roleId = rIDsql.rows[0].roleid;
                    //const managerId = mIDsql.rows[0].employeeId;
                    const params = [newEmp.firstName, newEmp.lastName, answers.Role, answers.manager];
                    pool.query(insertSQL, params);
                    console.log('employee added');
                    this.userInput();
                })
    }

    async updateEmployee() {
        const sqlEmp = await pool.query('SELECT * FROM employee');
        const employeeRes = sqlEmp.rows;
        const sqlRoles = await pool.query('SELECT * FROM roles');
        const roleRes = sqlRoles.rows;

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee',
                    choices: employeeRes.map((x) => {
                        return {
                            name: `${x.firstname} ${x.lastname}`,
                            value: x.employeeid,
                        };
                    })
                },
                {
                    type: `list`,
                    name: `role`,
                    message: 'Select a new role',
                    choices: roleRes.map((x) => {
                        return {
                            name: `${x.roletitle}`,
                            value: x.roleid,
                        };
                    })
                },
            ])
                .then(async (answers) => {
                    const empQuery = `UPDATE employee SET employeeRole = $1 WHERE employeeId = $2`;
                    const empParams = [answers.role, answers.employee];
                    pool.query(empQuery, empParams);
                    console.log('New role set');
                    this.userInput();
                })
    }

    async addRole() {
        const sqlDep = await pool.query('SELECT * FROM department');
        const deptRes = sqlDep.rows;
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department is this role in?',
                choices: deptRes.map((x) => {
                    return {
                        name: `${x.departmentname}`,
                        value: x.departmentid,
                    };
                })
            },
        ])
            .then(async (answers) => {
                const insertSQL = `INSERT INTO roles (roleTitle, roleSalary, roleDepartment) VALUES ($1, $2, $3)`;
                pool.query(insertSQL, [answers.name, answers.salary, answers.department]);
                console.log('department created');
                this.userInput();
            })
    }

    async addDepartment() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the department?',
                },
            ])
                .then(async (answers) => {
                    const insertSQL = `INSERT INTO department (departmentName) VALUES ($1)`;
                    pool.query(insertSQL, [answers.name]);
                    console.log('department created');
                    this.userInput();
                })
    }




    userInput() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        'View All Employees',
                        'Add Employee',
                        'Update Employee Role',
                        'View All Roles',
                        'Add Role',
                        'View All Departments',
                        'Add Department',
                        'Quit',
                    ],
                },
            ])
            .then((answers) => {
                if (answers.action === 'View All Employees') {
                    this.viewAllEmployees();
                }
                else if (answers.action === 'Add Employee') {
                    this.addEmployee();
                }
                else if (answers.action === 'Update Employee Role') {
                    this.updateEmployee();
                }
                else if (answers.action === 'View All Roles') {
                    this.viewAllRoles();
                }
                else if (answers.action === 'Add Role') {
                    this.addRole();
                }
                else if (answers.action === 'View All Departments') {
                    this.viewAllDepartments();
                }
                else if (answers.action === 'Add Department') {
                    this.addDepartment();
                }
                else if (answers.action === 'Quit') {
                    console.log("Have a good one");
                }
            })
    }
}

const MP = new ManagerProgram();

MP.userInput()
// export default ManagerProgram;