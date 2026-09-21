const express = require("express");
const dbConnection = require("./DB/db");
const app = express();
app.use(express.json());
const cors = require('cors');
const Data = require("./model/DataSchema");
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


app.post("/uploadanything", async (req, res) => {

    const data = req.body.data
    console.log(data)
    delete data.code;
    delete data.modTime;
    delete data.parentFolder;
    delete data.parentFolderCode;
    data.pageid = 3131;
    await Data.create(data);

    // {
    //   code: 'uCsUtIXM',
    //   createTime: 1790026871,
    //   downloadPage: 'https://gofile.io/d/4zgzIp97',
    //   guestToken: 'oDsKYtl6ZLreLxPzMQVpXnSHbXKtC6uq',
    //   id: '643cd497-e30b-4185-bf39-a833076adc67',
    //   md5: 'efd9baa99041555d5a1612772371fff6',
    //   mimetype: 'text/plain; charset=utf-8',
    //   modTime: 1790026871,
    //   name: 'ReturnRefundPolicy.jsx',
    //   parentFolder: 'c00eed48-ea5f-43a8-a375-fdfae369bc21',
    //   parentFolderCode: '4zgzIp97',
    //   servers: [ 'store9' ],
    //   size: 5501,
    //   type: 'file'
    // }

    // https://store9.gofile.io/download/web/643cd497-e30b-4185-bf39-a833076adc67/ReturnRefundPolicy.jsx

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

