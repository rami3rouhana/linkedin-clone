const WorkerService = require('../services/worker-service');
const UserAuth = require('./middlewares/auth');


module.exports = (app) => {

    const service = new WorkerService();

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

    app.post('/resume', UserAuth, async (req, res) => {

        const { _id } = req.user;

        const { path } = req.body;

        const { data } = await service.AddResume(_id, path);

        res.json(data);

    });


    app.delete('/position/:id', UserAuth, async (req, res) => {

        const { _id } = req.params.id;

        const { data } = await service.RemoveWorkerPositon(_id);

        res.json(data);

    });


    app.post('/position', UserAuth, async (req, res) => {
        const { _id } = req.user;
        const position = req.body.position

        const { data } = await service.AddWorkerPositon(_id, position);

        return res.json(data);
    });

    app.post('/follow', UserAuth, async (req, res) => {
        const { _id } = req.user;
        const { offerId, companyId, company, email, offers } = req.body;

        const follow = {
            offerId,
            companyId,
            company,
            email,
            offers
        }

        const { data } = await service.CreateCompanyFollow({ _id, follow });
        return res.status(200).json(data);
    });

    app.delete('/follow/:id', UserAuth, async (req, res) => {

        const { _id } = req.params.id;

        const { data } = await service.RemoveCompanyFollow(_id);

        res.json(data);

    });

    app.post('/offer', UserAuth, async (req, res) => {

        const { _id, offerId, position } = req.body;

        const offer = {
            offerId,
            position
        }

        const { data } = await service.AddCompanyOffer(_id, offer);

        res.json(data);

    });

    app.delete('/offer/:id', UserAuth, async (req, res) => {

        const offerId = req.params.id;
        const { _id } = req.body;

        const { data } = await service.RemoveCompanyOffer(_id, offerId);

        res.json(data);

    });

}
