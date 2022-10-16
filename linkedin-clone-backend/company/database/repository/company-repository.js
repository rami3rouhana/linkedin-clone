const mongoose = require('mongoose');
const { CompanyModel, OfferModel } = require('../models');

//Dealing with data base operations
class CompanyRepository {

    async CreateCompany({ email, password, name, salt }) {

        const company = new CompanyModel({
            name,
            email,
            password,
            salt
        })

        const companyResult = await company.save();
        return companyResult;
    }

    async FindCompany({ email }) {
        const existingCompany = await CompanyModel.findOne({ email: email });
        return existingCompany;
    }

    async CreateOffer(_id, position) {

        const offer = new OfferModel({
            companyId: _id,
            position,
            applicants: []
        })

        const offerResult = await offer.save();
        return offerResult;
    }

    async FindOffer(_id) {
        const existingoffer = await OfferModel.findOne(_id);
        return existingoffer;
    }

    async RemoveOffer(_id) {

        const offer = await OfferModel.deleteOne(_id);

        if (offer.deletedCount > 0)
            return offer;
    }

    async GetUsersOffers(_id) {

        const offers = await OfferModel.find({ companyId: _id });

        return offers;
    }

    async AddApplicant({ _id, newApplicant }) {

        try {
            const offer = await OfferModel.findOne({ _id });

            offer.applicants.push(newApplicant);

            const offerResult = await offer.save();
            return offerResult;
        } catch (error) {
            return FormateData({ msg: 'Error' });
        }
    }

}


module.exports = CompanyRepository;
