const CompanyService = require('../services/company-service');
const UserAuth = require('./middlewares/auth');


module.exports = (app) => {

    const service = new CompanyService();


    app.post('/signup', async (req, res) => {
        const { email, password, name } = req.body;
        const { data } = await service.SignUp({ email, password, name });
        res.json(data);

    });

    app.post('/login', async (req, res) => {

        const { email, password } = req.body;

        const { data } = await service.SignIn({ email, password });

        res.json(data);

    });

    app.post('/offer', UserAuth, async (req, res) => {

        const { _id } = req.user;

        const { position } = req.body;

        const { data } = await service.CreateNewOffer(_id, position);

        res.json(data);

    });


    app.delete('/offer/:id', UserAuth, async (req, res) => {

        const { _id } = req.params.id;

        const { data } = await service.RemoveOffer(_id);

        res.json(data);

    });


    app.get('/offer', UserAuth, async (req, res) => {
        const { _id } = req.user;

        const { data } = await service.GetOffers(_id);

        return res.json(data);
    });

    app.post('/applicant', UserAuth, async (req, res) => {

        const { _id, name, email, file, offerId } = req.body

        const applicant = {
            _id,
            name,
            email,
            file,
        }

        const { data } = await service.AddNewApplicant({_id: offerId, applicant});
        return res.status(200).json(data);
    });
}
