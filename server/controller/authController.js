import prismaClient from "../config/prismaClient.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendEmail from '../emailServices/emailServices.js'
import crypto from 'crypto'
const getUsers = async (req, res) => {
    console.log(req.user)
    try {
        const users = await prismaClient.user.findMany({
            include: {
                liked_categories: true,
                authored_questions: true,
                authored_answers: true,
                bookmarked_questions: true,
                bookmarked_answers: true,
                liked_questions: true,
                liked_answers: true,
                subscribed_questions: true,
            }
        }); 
        return res.status(200).json(users); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while fetching users"
        });
    }
};
/*
REQUEST EXAMPLE:

{
    "name": "John",
    "last_name": "Doe",
    "email": "example@gmail.com",
    "password": "12345678",
    "date_of_birth": "01/01/2025"
}

*/

const signUp = async (req, res) => {
    console.log(req.body);
    const { name, lastName, email, password, dateOfBirth } = req.body;

    const existingUser = await prismaClient.user.findUnique({
        where:{
            email: email
        }
    })

    if(existingUser){
        return res.status(400).json({
            message: "Email already in use!"
        });
    }

    const salt = await bcrypt.genSalt();

    const hashed_password = await bcrypt.hash(password, salt);

    const user = {
        name,
        last_name : lastName,
        email,
        hashed_password,
        date_of_birth: new Date(dateOfBirth)
    };

    try{

    const created_user = await prismaClient.user.create({
        data: user
    });

    delete created_user.hashed_password;

    return res.status(201).json({
        message: "User created successfully!",
        user: created_user
    });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


/*
REQUEST EXAMPLE:

{
    "email": "example@gmail.com",
    "password": "12345678"
}

*/

const logIn =  async (req, res) => {
    const {email , password} = req.body;
    try{
    const user = await prismaClient.user.findUnique({
        where:{
            email: email
        },
        select:{
            id: true,
            email: true,
            role: true,
            hashed_password: true
        }
    })

    if(!user){
        return res.status(401).json({
            message: "User with that email not found!",
        });
    }
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if(isMatch){

            delete user.hashed_password;

            const acess_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
            const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

            res.cookie('refresh_token',
            refresh_token, 
            { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 });  // 7 days

            const hashed_refresh_token = bcrypt.hashSync(refresh_token,10);

            await prismaClient.refresh_Token.create({
                data:{
                    user_id: user.id,
                    hashed_token: hashed_refresh_token,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            })


            return res.status(200).json({
                message: "User logged in!",
                user: user,
                token: acess_token
            });
        }else{
            return res.status(401).json({
                message: "Wrong password!",
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}

const refreshToken = async (req, res) => {
    const refresh_token = req.cookies?.refresh_token;

    if(!refresh_token){
        return res.status(403).json({
            message: "Log In expired"
        });
    }
    
    try {
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        
        const storedRefreshToken = await prismaClient.refresh_Token.findFirst({
            where: {
                user_id: decoded.id,
                revoked: false,
                expiresAt: { gte: new Date() }
            }
        });

        if (!storedRefreshToken) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        const isTokenValid = await bcrypt.compare(refresh_token, storedRefreshToken.hashed_token);

        if (!isTokenValid) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const userPayload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        const access_token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
        
        return res.status(200).json({
            message: "Token refreshed successfully!",
            user: userPayload,
            token: access_token
        });
    } catch(error) {
        console.log(error);
        return res.status(403).json({
            message: "Not Authorized"
        });
    }
};

const requestPassword = async (req, res) => {
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "User with that email not found!",
            });
        }

        let token = await prismaClient.Password_Reset_Token.findFirst({
            where: {
                user_id: user.id
            }
        });

        if (token) await prismaClient.Password_Reset_Token.delete({
            where: {
                id: token.id
            }
        });
        
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);

        await prismaClient.Password_Reset_Token.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                hashed_token: hash,
                createdAt: new Date()
            }
        });

        const link = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/passwordReset?token=${resetToken}&id=${user.id}`;
        
        await sendEmail(
            user.email,
            "Password Reset Request",
            {
                name: user.name,
                link: link,
            },
            "passwordReset"
        );
        
        return res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Password reset request error:", error);
        return res.status(500).json({
            message: "Error requesting password reset",
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: req.body.id
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found!",
            });
        }

        const hash = await bcrypt.hash(req.body.token, 10);

        const req_token = await prismaClient.Password_Reset_Token.findFirst({
            where:{
                user_id: req.body.id
            }
        })

        if(!req_token){
            return res.status(401).json({
                message: "Request not found!",
            });
        }

        const found_token = await bcrypt.compare(req_token.hashed_token,hash);

        await prismaClient.Password_Reset_Token.delete({
            where:{
                id: req_token.id
            }
        });


        const salt = await bcrypt.genSalt();

        const hashed_password = await bcrypt.hash(req.body.password, salt);

        const updated_user = await prismaClient.user.update({
            where:{
                id: user.id
            },
            data:{
                hashed_password: hashed_password
            }
        })

        res.status(200).json({
            message: "Password reset succesfully!"
        })


    }catch (error) {
            console.error("Password reset request error:", error);
            return res.status(500).json({
                message: "Error requesting password reset",
                error: error.message
            });
        }
}


export default { logIn, signUp, getUsers, refreshToken, requestPassword, resetPassword};