import jsonwt from 'jsonwebtoken'

class UserHelper {
    constructor(){
        if(!UserHelper.instance) {
            this.jwt = jsonwt;
            this.instance = this;
        }

        return UserHelper.instance;
    }
    
    verifyUser(token) {
        return this.jwt.verify(token, process.env.JWT_SECRET);
    }

    signUser(userId) {
        return this.jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 3600 });
    }
}

const instance = new UserHelper();
Object.freeze(instance);

export default instance;