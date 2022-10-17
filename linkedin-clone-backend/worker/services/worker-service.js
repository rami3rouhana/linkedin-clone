const { WorkerRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// All Business logic will be here
class WorkerService {

    constructor() {
        this.repository = new WorkerRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        const existingCompany = await this.repository.FindWorker({ email });

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

        const existingCompany = await this.repository.CreateWorker({ email, password: userPassword, name, salt });

        const token = await GenerateSignature({ email: email, _id: existingCompany._id });

        return FormateData({ id: existingCompany._id, token });

    }

    async AddResume(_id, path) {

        const resume = await this.repository.Addfile(_id, path);

        return FormateData(resume);
    }

    async AddWorkerPositon(_id, position) {

        const pos = await this.repository.AddPositions(_id, position);

        return FormateData(pos);
    }

    async RemoveWorkerPositon(_id) {

        const position = await this.repository.RemovePosition(_id);

        return FormateData(position);
    }

    async CreateCompanyFollow({ _id, follow }) {

        const companyResponse = await this.repository.CreateFollow({ _id, follow });

        return FormateData(companyResponse);

    }

    async RemoveCompanyFollow(_id) {

        const companyResponse = await this.repository.RemoveFollow(_id);

        return FormateData(companyResponse);

    }

    async AddCompanyOffer(offer, _id, offerId) {

        const offerResult = await this.repository.AddOffer(offer, _id, offerId);

        return FormateData(offerResult);

    }

    async RemoveCompanyOffer(_id, offerId) {

        const offerResult = await this.repository.RemoveOffer(_id, offerId);

        return FormateData(offerResult);

    }

    async GetWorkerInfo(_id, offerId) {

        const worker = await this.repository.GetWorker(_id, offerId);

        return FormateData(worker);
    }

    async GetApplicantPayload(_id, applicant, event) {

        if (applicant) {
            const payload = {
                event: event,
                data: { _id, applicant }
            };

            return payload
        } else {
            return FormateData({ error: 'No Order Available' });
        }
    }

    async SubscribeEvents(payload) {

        console.log('Triggering.... Worker Events')

        payload = JSON.parse(payload)

        const { event, data } = payload;

        const offerId = data.offer.offerId;
        const _id = data.offer._id;
        const offer = data.offer;


        switch (event) {
            case 'CREATE_OFFER':
                this.AddCompanyOffer(offer, _id);
                break;
            case 'REMOVE_OFFER':
                this.RemoveCompanyOffer(_id, offerId);
                break;
            default:
                break;
        }
    }

}

module.exports = WorkerService;
