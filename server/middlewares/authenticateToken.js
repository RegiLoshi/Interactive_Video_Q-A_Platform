import jwt from "jsonwebtoken"

const authenticate_token = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(403).json({ message: 'Token is required' });
    }

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }catch{
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export default authenticate_token;