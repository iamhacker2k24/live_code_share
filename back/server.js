const express = require("express");
const dbConnection = require("./DB/db");
const app = express();
app.use(express.json());
const cors = require('cors');
const Data = require("./model/DataSchema");
app.use(cors())



const GenarateUniqueRandomNumber = async () => {
    let pageId;
    let exists = true;
    while (exists) {
        pageId = Math.floor(Math.random() * 90000) + 10;
        exists = await Data.findOne({ pageid: pageId })
    }
    console.log(pageId)
    return pageId;
}



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
    let id = await GenarateUniqueRandomNumber();
    const data = req.body.data.gofileData
    // console.log(data)

    
    delete data.code;
    delete data.modTime;
    delete data.parentFolder;
    delete data.parentFolderCode;
    data.newid=data.id;
    data.pageid = id;
    console.log(data)
    await Data.deleteMany({});
    const result = await Data.create(data);

    res.status(200).send({
        sucess: true,
        id: id
    })
})








app.post("/findDataOfupload", async (req, res) => {
    const fileid = req.body.fileid;
    console.log(fileid);
    try {

        const dataExits = await Data.findOne({ pageid: fileid })
        if (dataExits) {
            res.status(200).send({
                sucess: true,
                msg: dataExits
            })
        }
        else {
            res.status(200).send({
                sucess: false,
                msg: "oye file id recheck kar "
            })
        }


    }
    catch (err) {
        res.status(200).send({
            sucess: true,
            msg: err.message
        })
    }
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

