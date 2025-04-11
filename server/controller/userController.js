import prismaClient from "../config/prismaClient.js"
const getUser = async (req,res) => {
    const {id} = req.params;
    console.log(id)
    try{
        const user = await prismaClient.user.findUnique({
            where: {
                user_id: id
            },
            select: {
                email: true,
                name: true,
                last_name: true
            }
        })
        console.log(user);
        return res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(404).json(error)
    }
}

export default {getUser};