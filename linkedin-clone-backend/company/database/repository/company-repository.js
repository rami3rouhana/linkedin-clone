const mongoose = require('mongoose');
const { CompanyModel, OfferModel } = require('../models');

//Dealing with data base operations
class ShoppingRepository {

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

    async FindOffer({ _id }) {
        const existingoffer = await OfferModel.findOne({ _id });
        return existingoffer;
    }

    async RemoveOffer(_id) {

        const offer = await OfferModel.findOne({ _id })

        offer.filter(off => off._id === _id);

        const offerResult = await offer.save();
        return offerResult;
    }

    async AddApplicant(_id, applicant) {

        const offer = await OfferModel.findOne({ _id })

        offer.applicants = { ...applicants, applicant }

        const offerResult = await offer.save();
        return offerResult;
    }

}

module.exports = ShoppingRepository;
