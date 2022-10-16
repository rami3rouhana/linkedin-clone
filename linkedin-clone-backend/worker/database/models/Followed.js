const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FollowedSchema = new Schema({
    workerId:{ type: String },
    companyId: { type: String },
    company: { type: String },
    email: { type: String },
    offers: [
        {
            offerId: { type: String },
            position: { type: String },
            viewed: { type: Boolean, default: true }
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

module.exports = mongoose.model('followed', FollowedSchema);
