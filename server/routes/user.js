const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db"); //.js생략상태

const jwt = require('jsonwebtoken');
// 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.
const JWT_KEY = "server_secret_key"; // 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.

router.post('/join', async (req, res) => {
    let { userId, pwd, userName } = req.body
    console.log(req.body);
    try {
        const hashPwd = await bcrypt.hash(pwd, 10);
        console.log(hashPwd);
        let sql = "INSERT INTO TBL_USER (USERID, PWD, USERNAME, CDATETIME, udatetime) "
            + " VALUES (?, ? ,?, NOW(), NOW())"

        let result = await db.query(sql, [userId, hashPwd, userName]);

        res.json({
            msg: "success",
            result: result,
        });
    } catch (error) {
        console.log("에러 발생!");
        console.log(error);
    }
})


router.post('/login', async (req, res) => {
    let { userId, pwd } = req.body
    console.log(req.body);
    try {
        let sql = "SELECT * FROM TBL_USER WHERE USERID = ?"
        let [list] = await db.query(sql, [userId]);
        let msg = "";
        let result = "fail";
        let token = null;
        if (list.length > 0) {
            //아이디 존재
            const match = await bcrypt.compare(pwd, list[0].pwd);
            if (match) {
                // console.log("1111");
                msg = list[0].userId + "님 환영합니다!";
                result = "success";
                // console.log("2222");
                let user = {
                    userId: list[0].userId,
                    userName: list[0].userName,
                    status : "A" //권한 하드코딩 (db없어서)
                    // 권한 등 필요한 정보 추가
                };
                // console.log("3333");
                token = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
                //  const token = jwt.sign({userId : user.id, name : user.name}, JWT_KEY, {expiresIn : '1h'});
                console.log(token);
                // 토큰 담아서 리턴
                res.json({
                    msg, //msg : msg
                    result,  //result : result
                    token //token:token
                });
            } else {
                msg = "비밀번호를 확인해라";
            }
        } else {
            //아이디 없음
            msg = "해당 아이디는 존재하지 않습니다."
        }

        res.json({
            msg: msg,
            result: result,
        });
    } catch (error) {
        console.log("에러 발생!");
        console.log(error);
    }
})


module.exports = router;