--Create new database
DROP DATABASE IF EXISTS company;
CREATE DATABASE company;

\c company

-- Create a department table
CREATE TABLE department (
    departmentId SERIAL PRIMARY KEY,
    departmentName VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    roleId SERIAL PRIMARY KEY,
    roleTitle VARCHAR(30) UNIQUE NOT NULL,
    roleSalary DECIMAL NOT NULL,
    roleDepartment INTEGER NOT NULL,
    FOREIGN KEY (roleDepartment) REFERENCES department(departmentId)
);

CREATE TABLE employee (
    employeeId SERIAL PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    employeeRole INTEGER NOT NULL,
    managerId INTEGER,
    FOREIGN KEY (employeeRole) REFERENCES roles(roleId),
    FOREIGN KEY (managerId) REFERENCES employee(employeeId)
);

