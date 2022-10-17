const { CompanyRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// All Business logic will be here
class CompanyService {

    constructor() {
        this.repository = new CompanyRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        const existingCompany = await this.repository.FindCompany({ email });

        if (existingCompany) {

            const validPassword = await ValidatePassword(password, existingCompany.password, existingCompany.salt);
            if (validPassword) {
                const token = await GenerateSignature({ email: existingCompany.email, _id: existingCompany._id });
                return FormateData({ id: existingCompany._id, token });
            }
        }

        return FormateData(null);
    }

    async SignUp(userInputs) {

        const { name, email, password } = userInputs;

        // create salt
        let salt = await GenerateSalt();

        let userPassword = await GeneratePassword(password, salt);

        const existingCompany = await this.repository.CreateCompany({ email, password: userPassword, name, salt });

        const token = await GenerateSignature({ email: email, _id: existingCompany._id });

        return FormateData({ id: existingCompany._id, token });

    }

    async CreateNewOffer(_id, position) {

        const addressResult = await this.repository.CreateOffer(_id, position);

        return FormateData(addressResult);
    }

    async RemoveOffer(_id, companyId) {

        const addressResult = await this.repository.RemoveOffer(_id, companyId);

        return FormateData(addressResult);
    }

    async GetOffers(_id) {

        const addressResult = await this.repository.GetUsersOffers(_id);

        return FormateData(addressResult);
    }

    async AddNewApplicant(_id, applied) {

        const applicantResult = await this.repository.AddApplicant( _id, applied );


        return FormateData(applicantResult);


    }

    async SubscribeEvents(payload) {

        console.log('Triggering.... Worker Events')

        payload = JSON.parse(payload);

        const { event, data } = payload;

        const _id = data.applicant.offerId

        const applied = {
            _id: data.applicant.worker._id,
            name: data.applicant.worker.name,
            email: data.applicant.worker.email,
            file: data.applicant.worker.file
        }

        switch (event) {
            case 'ADD_APPLICANT':
                this.AddNewApplicant(_id, applied);
                break;
            default:
                break;
        }
    }

    async GetOfferPayload(_id, offer, event) {

        if (offer) {
            const payload = {
                event: event,
                data: { _id, offer }
            };

            return payload
        } else {
            return FormateData({ error: 'No Order Available' });
        }
    }

}

module.exports = CompanyService;
