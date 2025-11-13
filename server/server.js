const express = require('express')
const cors = require('cors')
const db = require("./db"); //.js생략상태
const app = express()
app.use(cors({
    origin: ["http://192.168.30.45:5500"], //여기서 들어오는건 안막겠다는 뜻
    credentials: true
}))
app.use(express.json());

app.get('/', function (req, res) {
    res.send('test1')
})

app.get('/test', (req, res) => {
    res.send("test page(get)");
})

app.post('/test', (req, res) => {
    res.send("test page(post)");
})

app.get('/student', async (req, res) => {
    try {
        let sql = "SELECT * FROM STUDENT";
        let [list] = await db.query(sql);
        // console.log(list);
        res.json({
            result: "success",
            list: list,
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

app.get('/student/:stuNo', async (rq, res) => {
    let { stuNo } = rq.params;
    console.log(stuNo);
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = " + stuNo;
        let [list] = await db.query(sql);
        // console.log(list);
        res.json({
            result: "success",
            info: list[0],
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

app.delete('/student/:stuNo', async (rq, res) => {
    let { stuNo } = rq.params;
    console.log(stuNo);
    try {
        let sql = "DELETE FROM STUDENT WHERE STU_NO = " + stuNo;
        let result = await db.query(sql);
        console.log("result ==> ", result);
        res.json({
            result: result,
            msg: "success",
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

app.post('/student', async (req, res) => {
   
    let {stuNo, stuName, stuDept} = req.body
    console.log(req.body);
    console.log(stuNo, stuName, stuDept);
    try {
        let sql = "INSERT INTO STUDENT (STU_NO, STU_NAME, STU_DEPT) VALUES(?,?,?)";
        let result = await db.query(sql, [stuNo,stuName,stuDept]);
       
        res.json({
            msg : "success",
            result: result,
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

app.get('/student/login/:stuNo/:stuName', async (req, res) => {
    let { stuNo, stuName } = req.params;
    console.log("여긴서버"+ stuNo);
    console.log("여긴서버"+ stuName);
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = " + stuNo + " AND STU_NAME = '" + stuName+ "'";
        console.log(sql);
        // let result = await db.query(sql);
        // console.log("학생조회결과result ==> ", result);
        let [list] = await db.query(sql);
        console.log(list);
        res.json({
            result: "success",
            info: list[0],
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

app.listen(3000, () => {
    console.log("server start!");
})