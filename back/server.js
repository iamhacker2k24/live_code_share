const express = require("express");
const dbConnection = require("./DB/db");
const app = express();
app.use(express.json());
const cors = require('cors')
app.use(cors())


app.get("/", (req, res) => {
    try {
        res.status(200).send({
            sucess: true,
            msg: "server working perfectly"
        })

    } catch (error) {
    
        res.status(400).send({
            sucess: true,
            msg: error.message
        })
    }

})


app.post("/uploadanything", (req, res) => {
    console.log(req.body.data)

    
    res.status(200).send({
        sucess: true,
        msg: "error.message"
    })
})


const dbConnect = async () => {
    try {

        await dbConnection()
        app.listen(3000, () => {
            console.log("server started at 3000")
        })

    } catch (error) {
        console.log(error)
    }

}

dbConnect();

