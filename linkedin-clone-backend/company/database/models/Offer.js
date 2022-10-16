const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    _id: { type: String, require: true },
    companyId: { type: String, require: true },
    position: { type: String },
    applicants: [
        {
            _id: { type: String, require: true },
            name: { type: String },
            email: { type: String },
            file: { type: String },
        }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('offer', OfferSchema);
