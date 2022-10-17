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

    async AddOffer(offer, _id) {

        
        const followed = await FollowedModel.find({ companyId: _id });
        

        followed.map(async follow => {
            follow.offers.push({
                offerId: offer._id,
                position: offer.position,
            });
            await follow.save();
        })

        return { message: "OFFERS REFACTORED" };
    }

    async RemoveOffer(_id, offerId) {

        const followed = await FollowedModel.find({ companyId: _id })

        if (followed) {
            followed.map(async follow => {
                follow.offers.pull({ offerId });
                await follow.save();
            })

            return { message: "OFFERS REFACTORED" };
        }
    }

    async GetWorker(_id, offerId) {

        const worker = await WorkerModel.findOne({ _id })

        return {worker,offerId};

    }

}

module.exports = WorkerRepository;
