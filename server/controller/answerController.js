import prismaClient from "../config/prismaClient.js"
const addAnswer = async (req, res) => {
    console.log(req.body)
    const answers = req.body;

    try {
        const createdAnswers = await prismaClient.answer.createMany({
                data: answers
            })
        return res.status(201).json(createdAnswers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating answer"
        });
    }
}

const getAnswers = async (req, res) => {
    const {surveyId} = req.params;
    try {
        const uniqueUsers = await prismaClient.answer.findMany({
            where: {
                surveyId: surveyId
            },
            select: {
                created_at: true,
                author: {
                    select: {
                        user_id: true,
                        name: true,
                        last_name: true,
                        email: true
                    }
                }
            },
            distinct: ['authorId']
        });
        return res.status(200).json(uniqueUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching unique users"
        });
    }
}

export default { addAnswer,getAnswers};
