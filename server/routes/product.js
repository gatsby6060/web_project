const express = require('express');
const router = express.Router();
const db = require("../db"); //.js생략상태

router.get("/", async(req, res) => {
    try {
        // res.send("product 테스트"); 이거 보내면 아래에서 또 보내서 에러남
        let sql = "SELECT * FROM TBL_PRODUCT";
        let [list] = await db.query(sql);
        console.log(list);
        res.json({
            result: "success",
            list: list,
        });
    } catch (error) {
        console.log("product 에러발생! ", error);
    }
})

router.delete('/:prodId', async (rq, res) => { //꺼낼때 ID명은 내맘대로 가능함
    console.log("일단 제품 딜리트 서버 진입"); // ajax 든 fetch든 잘 동작함
    let { prodId } = rq.params; //꺼낼떄 이름을 그대로 사용
    console.log("날아온 아이디는" + prodId);
    try {
        let sql = "DELETE FROM TBL_PRODUCT WHERE PRODUCTID = " + prodId;
        let result = await db.query(sql);
        console.log("result ==> ", result);
        res.json({
            result: result,
            msg: "success", //내맘대로 문자 넣어서 보냄
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

router.post('/', async (req, res) => {

    let { productName, price, category } = req.body
    // console.log(req.body);
    console.log(productName, price, category);
    try {
        let sql = "INSERT INTO TBL_PRODUCT"
                 +"(PRODUCTNAME, PRICE, category, cdatetime , UDATETIME) "
                 +"VALUES(?, ?, ?, NOW(), NOW())";
        console.log(sql);
        let result = await db.query(sql, [productName, price, category]);

        res.json({
            result: result,
            msg: "success",
        });
    } catch (error) {
        console.log("에러발생!");
    }
})



router.put('/:productId', async (req, res) => {
    let { productId } = req.params;
    let { productName, price, category } = req.body;
    console.log(req.body);
    console.log(req.params);
    try {
        let sql = "UPDATE TBL_PRODUCT SET "
                + "PRODUCTNAME = ?, "
                + "PRICE= ?, "
                + "category = ?, "
                + "UDATETIME = NOW() "
                + "WHERE PRODUCTID = ? "
        let result = await db.query(sql, [productName, price, category, productId]);
        // console.log("result ==> ", result);
        res.json({
            result: result,
            msg: "success",
        });
    } catch (error) {
        console.log("에러발생!");
    }
})

module.exports = router;