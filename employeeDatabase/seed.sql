INSERT INTO department (departmentName)
VALUES ('HR'),
        ('Tech'),
        ('Customer Service');

INSERT INTO roles (roleTitle, roleSalary, roleDepartment)
VALUES ('Hiring Manager', 10, 1),
('Programmer 1', 20, 2),
('Programmer 2', 40, 2),
('Tech Support', 1, 3);

INSERT INTO employee (firstName, lastName, employeeRole, managerId)
VALUES 
('Rose', 'A', 3, null),
('Tim', 'B', 2, 1),
('Sammi', 'C', 1, null),
('Anthony', 'D', 4, 2),
('Tina', 'E', 4, 2);