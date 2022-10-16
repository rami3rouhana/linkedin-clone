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

    async CreateOffer(companyId, position) {

        const offer = new OfferModel({
            companyId,
            position,
            applicants: []
        })

        const offerResult = await offer.save();
        return offerResult;
    }

    async RemoveOffer(id) {

        const offer = await OfferModel.findOne({ _id: id })

        offer.filter(off => off._id === id);

        const offerResult = await offer.save();
        return offerResult;
    }

    async AddApplicant(id, { _id, name, email, file, }) {

        const offer = await OfferModel.findOne({ _id: id })
        const applicant = {
            _id,
            name,
            email,
            file,
        }
        offer.applicants = { ...applicants, applicant }

        const offerResult = await offer.save();
        return offerResult;
    }

}

module.exports = ShoppingRepository;
