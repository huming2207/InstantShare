import jsonwt from 'jsonwebtoken'

export default class UserHelper {

    static instance;
  
    constructor(){
        if(instance){
            return instance;
        }

        this.jwt = jsonwt;
        this.instance = this;
    }
    
    verifyUser(token) {
        return this.jwt.verify(token, process.env.JWT_SECRET);
    }

    signUser(userId) {
        return this.jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 3600 });
    }

}