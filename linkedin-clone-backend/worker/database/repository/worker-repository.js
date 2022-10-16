const mongoose = require('mongoose');
const { FollowedModel, WorkerModel } = require('../models');

//Dealing with data base operations
class WorkerRepository {

    async CreateWorker({ email, password, name, salt }) {

        const worker = new WorkerModel({
            name,
            email,
            password,
            salt
        })

        const workerResult = await worker.save();
        return workerResult;
    }

    async FindWorker({ email }) {

        const worker = await WorkerModel.findOne({ email: email })

        return worker;
    }

    async Addfile(id, path) {

        const worker = await WorkerModel.findOne({ _id: id })

        worker.file = path;

        const workerResult = await worker.save();
        return workerResult;
    }

    async AddPositions(id, pos) {

        const worker = await WorkerModel.findOne({ _id: id })

        worker.positions.push({ position: pos });

        console.log(worker)

        const workerResult = await worker.save();
        return workerResult;
    }

    async RemovePosition(id) {

        const worker = await WorkerModel.deleteOne(id);

        if (worker.deletedCount > 0)
            return worker;
    }

    async CreateFollow({ _id, follow }) {

        const followed = new FollowedModel({
            workerId: _id,
            companyId: follow.companyId,
            company: follow.company,
            email: follow.email,
        })
        follow.offers.map(offer => {
            followed.offers.push({ offerId: offer.offerId, position: offer.position });
        })

        const followedResult = await followed.save();
        return followedResult;
    }

    async RemoveFollow(_id) {

        const followed = await FollowedModel.deleteOne(_id);

        if (followed.deletedCount > 0)
            return followed;
        else {
            return { error: "Not Found" }
        }
    }

    async AddOffer(_id, offer) {

        const followed = await FollowedModel.findOne({ _id })

        if (followed) {
            followed.offers.push(offer);

            const followedResult = await followed.save();
            return followedResult;
        }
        return {}
    }

    async RemoveOffer(_id, offerId) {

        const followed = await FollowedModel.findOne({ _id })

        if (followed) {
            followed.offers.pull({ _id: offerId });

            const followedResult = await followed.save();
            return followedResult;
        }
        return {}
    }

}

module.exports = WorkerRepository;
