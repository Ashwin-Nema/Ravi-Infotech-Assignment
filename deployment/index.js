const express = require('express')
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const app = express()
const DetailsModel = require('./detailsmodel')
const path = require('path');
app.use(express.json({ limit: '5242980kb' }));
app.use(express.urlencoded({ limit: '5242980kb' }));
app.use(express.static(path.join(__dirname, 'build')));


const databaseconnection = require('./database')
const nodemailer = require('nodemailer');

const { CLOUDNAME, APIKEY, APISECRET } = process.env
const { EMAIL, PASSWORD, CLIENTID, CLIENTSECRET, REFRESHTOKEN } = process.env
const PORT = process.env.PORT || 5000
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: EMAIL,
        pass: PASSWORD,
        clientId: CLIENTID,
        clientSecret: CLIENTSECRET,
        refreshToken: REFRESHTOKEN
    }
});
cloudinary.config({
    cloud_name: CLOUDNAME,
    api_key: APIKEY,
    api_secret: APISECRET
});


app.post('/', async (req, res) => {
    try {
        const { base64urlmediaurl, locationName, address, googleMapLink, description, email, emailbody, filetype, startDate, endDate } = req.body

        if (!base64urlmediaurl || !locationName || !address || !googleMapLink || !description || !email || !emailbody || !filetype || !startDate || !endDate) {
            res.status(404).send("Data provided is not correct")
            return
        }

        const regx = /^([a-z0-9\.-]+)@([a-z0-9-]+).([a-z]{2,8})(.[a-z]{2,8})?$/
        if (regx.test(email) == false) {
            res.status(404).send("Email provided is not correct")
            return
        }

        const imagedata = await cloudinary.uploader.upload(base64urlmediaurl,
            { resource_type: "auto" });
        const { secure_url: mediaurl } = imagedata
        const startdateobject = new Date(startDate)
        const enddateobject = new Date(endDate)
        if (isNaN(startdateobject) || isNaN(enddateobject)) {
            res.status(404).send("Date object sent are not proper")
        }

        if (startdateobject.getTime() > enddateobject.getTime()) {
            res.status(404).send("Time objects provided are not proper")
        }

        const details = new DetailsModel(
            {
                mediaurl,
                locationName,
                address,
                googleMapLink,
                description,
                email,
                emailbody,
                filetype,
                startDate,
                endDate
            }
        )


        const saveddetails = await details.save()
        const message = {
            from: EMAIL,
            to: email,
            subject: "Details Mail Mail",
            text: emailbody
        }
        transporter.sendMail(message, (err) => {
            if (err) {
                return
            }
        });

        res.json({ saveddetails })
    } catch {
        res.status(500).send("Sorry something went wrong")
    }
})

app.get('/:id', async (req, res) => {
    try {
        const data = await DetailsModel.findById(req.params.id)
        res.json({ data })
    } catch (error) {
        res.status(404).send("Sorry data for id not found")
    }
})

app.get('/*', function (_, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(PORT, () => databaseconnection())