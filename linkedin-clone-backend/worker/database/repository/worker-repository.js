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

    async Addfile(id, path) {

        const worker = await WorkerModel.findOne({ _id: id })

        worker.file = path;

        const workerResult = await worker.save();
        return workerResult;
    }

    async AddPositions(id, position) {

        const worker = await WorkerModel.findOne({ _id: id })

        worker.positions = { ...positions, position };;

        const workerResult = await worker.save();
        return workerResult;
    }

    async RemovePosition(id, position) {

        const worker = await WorkerModel.findOne({ _id: id })

        worker.positions.filter(pos => pos === position);

        const workerResult = await worker.save();
        return workerResult;
    }

    async CreateFollow(workerId, { companyId, name, offers }) {

        const followed = new FollowedModel({
            workerId,
            companyId,
            company: name,
            offers
        })

        const followedResult = await followed.save();
        return followedResult;
    }

    async RemoveFollow(workerId, companyId) {

        const followed = await FollowedModel.findOne({ workerId, companyId })
        followed.filter(follow => follow._id === followed._id)

        const followedResult = await followed.save();
        return followedResult;
    }

    async AddOffer(id, { offer }) {

        const followed = await FollowedModel.findOne({ _id: id })

        if (followed) {
            followed.offers = { ...offers, offer };

            const followedResult = await followed.save();
            return followedResult;
        }
        return {}
    }

    async RemoveOffer(id, offerId) {

        const followed = await FollowedModel.findOne({ _id: id })

        if (followed) {
            followed.offers.filter(offer => offer.offerId == offerId)

            const followedResult = await followed.save();
            return followedResult;
        }
        return {}
    }

}

module.exports = WorkerRepository;
