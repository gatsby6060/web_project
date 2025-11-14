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

    let { stuNo, stuName, stuDept } = req.body
    console.log(req.body);
    console.log(stuNo, stuName, stuDept);
    try {
        let sql = "INSERT INTO STUDENT (STU_NO, STU_NAME, STU_DEPT) VALUES(?,?,?)";
        let result = await db.query(sql, [stuNo, stuName, stuDept]);

        res.json({
            msg: "success",
            result: result,
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

app.get('/student/login/:stuNo/:stuName', async (req, res) => {
    let { stuNo, stuName } = req.params;
    console.log("여긴서버" + stuNo);
    console.log("여긴서버" + stuName);
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = " + stuNo + " AND STU_NAME = '" + stuName + "'";
        console.log(sql);
        let [list] = await db.query(sql);
        console.log(list);
        if (list.length > 0) {
            console.log("맞는 학번, 이름 있네용");
            res.json({
                result: "success",
                info: list[0],
            });
        } else {
            console.log("맞는 학번, 이름이 없습니다.");
            let sql = "SELECT * FROM STUDENT WHERE STU_NAME = '" + stuName + "'";
            let [list] = await db.query(sql);
            console.log(list);
            if (list.length <= 0) {
                console.log("이름이 없네요");
                res.json({
                    result: "noName",
                });

            } else {
                console.log("이름은 있네요");
                res.json({
                    result: "justStuName",
                });

            }

            // sql = "SELECT * FROM STUDENT WHERE STU_NO = " + stuNo + "";
            // let [list2] = await db.query(sql);
            // console.log(list2);
            // if (list.length > 0) {
            //         res.json({
            //             result: "justStuNo",
            //         });
            //     }

        }
    } catch (error) {
        console.log("에러발생!");
    }
})

//로그인용 포스트방식(선생님)
app.post('/student/login', async (req, res) => {
    let { stuNo, stuName } = req.body
    console.log(req.body);
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = ?";
        let [list] = await db.query(sql, [stuNo]);
        let msg = "";
        let result = "fail";
        if (list.length > 0) {
            // 학번으로 조회 성공
            if (list[0].stu_name == stuName) {
                msg = list[0].stu_name + "님 환영합니다!";
                result = "success";
            } else {
                msg = "해당 이름을 가진 학생이 없습니다.";
            }
        } else {
            // 학번 조회 실패
            msg = "학번을 확인해주세요.";
        }
        console.log(list);
        res.json({
            msg: msg,
            result: result
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

app.put('/student/:stuNo', async (req, res) => {
    let { stuNo } = req.params;
    let { stu_name, stu_dept, stu_gender, stu_height } = req.body;
    console.log(req.body);
    console.log(req.params);
    try {
        let sql = "UPDATE STUDENT SET "
                + "STU_NAME = ?, "
                + "STU_DEPT = ?, "
                + "STU_GENDER = ?, "
                + "STU_HEIGHT = ? "
                + "WHERE STU_NO = ? "
        let result = await db.query(sql, [stu_name, stu_dept, stu_gender, stu_height, stuNo]);
        // console.log("result ==> ", result);
        res.json({
            result: result,
            msg: "success",
        });
    } catch (error) {
        console.log("에러발생!");
    }
})


app.listen(3000, () => {
    console.log("server start!");
})