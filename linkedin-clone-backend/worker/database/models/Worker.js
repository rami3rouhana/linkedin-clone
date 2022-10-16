const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
    name: String,
    email: String,
    password: String,
    salt: String,
    positions: [{ position: String }],
    file: String,
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('worker', WorkerSchema);
