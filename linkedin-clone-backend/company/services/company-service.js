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

    async RemoveOffer(_id) {

        const addressResult = await this.repository.RemoveOffer(_id);

        return FormateData(addressResult);
    }

    async GetOffers(_id) {

        const addressResult = await this.repository.GetUsersOffers(_id);

        return FormateData(addressResult);
    }

    async AddNewApplicant({ _id, applicant }) {

        const newApplicant = {
            _id: applicant._id,
            name: applicant.name,
            email: applicant.email,
            file: applicant.file
        }

        const applicantResult = await this.repository.AddApplicant({_id, newApplicant});


        return FormateData(applicantResult);


    }

}

module.exports = CompanyService;
