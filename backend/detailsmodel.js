const mongoose = require('mongoose')
const DetailsSchema = new mongoose.Schema({
    mediaurl: {
        type: String,
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    googleMapLink: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailbody: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        required: true,
        enum: ["audio", "video", "image"]
    },
    startDate: {
        type: Date,
        required: true,

    }, 
    endDate: {
        type: Date,
        required: true
    }
}
)

const DetailsModel = mongoose.model('Details', DetailsSchema)

module.exports = DetailsModel