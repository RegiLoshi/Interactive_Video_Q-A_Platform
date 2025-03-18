import prismaClient from "../config/prismaClient.js"
import bcrypt from "bcrypt"


const getUsers = async (req, res) => {
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
    const { name, last_name, email, password, date_of_birth } = req.body;

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
        last_name,
        email,
        hashed_password,
        date_of_birth: new Date(req.body.date_of_birth)
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

            return res.status(200).json({
                message: "User logged in!",
                user: user
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

export default { logIn, signUp, getUsers };