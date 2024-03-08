const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('./db/todo.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
  db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, description TEXT NOT NULL)', (err)=> {
    if(err) 
    {
      console.error(err.message);
    }
    else 
    {
      console.log('Created the todos table.');
    }
  });
});

app.use(express.static('public'));

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/todos', (req, res) => {
  const { category, description } = req.body;
  db.run(`INSERT INTO todos (category, description) VALUES (?, ?)`, [category, description], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: this.lastID });
  });
});

app.put('/todos/:id', (req, res) => {
  const { category, description } = req.body;
  db.run(`UPDATE todos SET category = ?, description = ? WHERE id = ?`, [category, description, req.params.id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ updatedID: this.changes });
  });
});

app.delete('/todos/:id', (req, res) => {
  db.run(`DELETE FROM todos WHERE id = ?`, req.params.id, function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ deletedID: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
