const express = require('express')
const cors = require('cors')

const stuRouter = require("./routes/student");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

const app = express()
app.use(cors({
    origin: ["http://192.168.30.45:5500","http://192.168.30.45:5501"], //여기서 들어오는건 안막겠다는 뜻
    // origin: "*", //모조리 안막겟다
    credentials: true
}))
app.use(express.json());

//router 영역
app.use("/student", stuRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);




app.listen(3000, () => {
    console.log("server start!");
})