import jwt from 'jsonwebtoken'

export function verifyUser(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function signUser(user) {
    return jwt.sign({ email: user.email, nickName: user.nickName, id: user._id }, process.env.JWT_SECRET)
}

export function getUserToken(req) {
    const header = req.header('Authorization');
    if(!header) return { passed: false, decodedUser: null, message: "No header found!", statusCode: 400 };

    const token = header.split(' ');
    if(!token || !token.length || token.length < 2) 
        return { passed: false, decodedUser: null, message: "Header format is incorrect!", statusCode: 422 };

    try {
        const user = verifyUser(token[1]);
        if(!user || !user.id) 
            return { passed: false, decodedUser: null, message: "Failed to auth user!", statusCode: 401 };
        return { passed: true, decodedUser: user, message: "User is valid", statusCode: 200 };
    } catch(err) {
        return { passed: false, decodedUser: null, message: "Failed with error: " + err, statusCode: 401 };
    }
}