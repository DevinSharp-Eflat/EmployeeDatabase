import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connections.ts';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Read all employees
app.get('/api/employee', (_req, res) => {
  const sql = 'SELECT * FROM employee';

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json(rows);
  });
});

//view all roles
app.get('/api/role', (_req, res) => {
  const sql = 'SELECT * FROM roles';

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

//view all departments
app.get('/api/department', (_req, res) => {
  const sql = 'SELECT * FROM department';

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

//Create an Employee
app.post('/api/new-employee', ({body}, res) => {
  const sql = `INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES ($1, $2, $3, $4)`;
  const params = [body.firstName, body.lastName, body.roleId, body.managerId];
  pool.query(sql, params, (err, _result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
})

//Delete an Employee
app.delete('/api/delete-employee/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE employeeId = $1`;
  const params = [req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.rowCount) {
      res.json({
        message: 'Movie not found',
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.rowCount,
        id: req.params.id,
      });
    }
  });
});

//update an employee role
app.put('/api/employee/:id', (req, res) => {
  const sql = `UPDATE employee SET roleId = $1 WHERE employeeId = $2`;
  const params = [req.body.roleId, req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.rowCount) {
      res.json({
        message: 'Employee not found',
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.rowCount,
      });
    }
  });
});

//add a role
app.post('/api/new-role', ({body}, res) => {
  const sql = `INSERT INTO roles (roleTitle, roleSalary, roleDepartment) VALUES ($1, $2, $3)`;
  const params = [body.roleTitle, body.roleSalary, body.roleDepartment];
  pool.query(sql, params, (err, _result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
})

//add a department
app.post('/api/new-department', ({body}, res) => {
  const sql = `INSERT INTO department (departmentName) VALUES ($1)`;
  const params = [body.departmentName];
  pool.query(sql, params, (err, _result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
})


// Default response for any other request (Not Found)
app.use((_req, res) => {
    res.status(404).end();
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  