const authenticate_role = (req, res, next) => {
    const user = req.user;
    if(!user){
        return res.status(403).json({ message: 'User error' });
    }
    if(user.role != 'ADMIN'){
        return res.status(401).json({ message: 'Not authorized only admin' });
    }

    try{
        next();
    }catch{
        return res.status(500).json({ message: 'Error' });
    }
}

export default authenticate_role;