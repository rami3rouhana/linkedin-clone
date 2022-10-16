const { CompanyRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// All Business logic will be here
class CustomerService {

    constructor() {
        this.repository = new CompanyRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        const existingCompany = await this.repository.FindCustomer({ email });

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

    async CreateNewOffer(_id, userInputs) {

        const { position } = userInputs;

        const addressResult = await this.repository.CreateOffer(_id, position);

        return FormateData(addressResult);
    }

    async RemoveOffer(_id) {

        const addressResult = await this.repository.RemoveOffer(_id);

        return FormateData(addressResult);
    }

    async AddNewApplicant(_id, userInputs) {

        const offerExist = await this.repository.FindCompany(_id);

        if (offerExist) {

            const applicant = {
                id: userInputs._id,
                name: userInputs.name,
                email: userInputs.email,
                file: userInputs.file
            }

            const addressResult = await this.repository.CreateOffer(_id, applicant);

            return FormateData(addressResult);
        }
        return FormateData({ msg: 'Error' });

    }

    async GetShopingDetails(id) {

        const existingCompany = await this.repository.FindCustomerById({ id });

        if (existingCompany) {
            // const orders = await this.shopingRepository.Orders(id);
            return FormateData(existingCompany);
        }
        return FormateData({ msg: 'Error' });
    }

    async GetWishList(customerId) {
        const wishListItems = await this.repository.Wishlist(customerId);
        return FormateData(wishListItems);
    }

    async AddToWishlist(customerId, product) {
        const wishlistResult = await this.repository.AddWishlistItem(customerId, product);
        return FormateData(wishlistResult);
    }

    async ManageCart(customerId, product, qty, isRemove) {
        const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);
        return FormateData(cartResult);
    }

    async ManageOrder(customerId, order) {
        const orderResult = await this.repository.AddOrderToProfile(customerId, order);
        return FormateData(orderResult);
    }

}

module.exports = CustomerService;
