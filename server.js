const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.get('/',(req,res)=>{
    res.send({error: true,message:'WelCome'});
});
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_data'
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.get('/students',(req,res)=>{
    db.query('SELECT * FROM student',(error,result,field)=>{
        if(error){
            throw error;
        }
            return res.send({
            error:false,
            message:'Student is...',
            data:result
        })
    })
});

app.get('/student/:id',(req,res)=>{
    let id = req.params.id;
    if(!id){
        return res.status(400).send('Please provise valid id');
    }
    db.query('SELECT * FROM student where id=?',id,(error,result,field)=>{
        if(error){
            throw error;
        }
        return res.send({error:false,
            message:'Student is..',
            data:result[0]
        })
    })
});

app.post('/student',(req,res)=>{
    let student = req.body;
    console.log(student);
    if(!student){
        return res.status(400).send('Please Enter valid Data');
    }
    db.query("INSERT INTO student SET ? ",student,(error,result,field)=>{
        if(error)
         throw error;
        return res.send({
            error:false,
            message:'Student is..',
            data:result
        })
    })
});

app.put('/student', function (req, res) {

    let id = req.body.id;
    console.log(id);
    let student = req.body;
    console.log(student);
    if (!id || !student) {
        return res.status(400).send({ error: student, message: 'Please provide user and id' });
    }

    db.query("UPDATE student SET name = ?,email = ?,address = ? WHERE id = ?", [student.name,student.email,student.address, id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Student has been updated successfully.' });
    });
});

app.delete('/student', function (req, res) {

    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide student id' });
    }
    db.query('DELETE FROM student WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Student has been updated successfully.' });
    });
}); 


app.listen(3000,()=>console.log("Server is running on 3000"));

