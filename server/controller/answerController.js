import prismaClient from "../config/prismaClient.js"
const addAnswer = async (req, res) => {
    console.log(req.body)
    const { answers, surveyId, userId } = req.body;

    console.log(answers);
    console.log(surveyId);
    console.log(userId);

    try {
        return res.status(201).json(answers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating answer"
        });
    }
}

export default { addAnswer };
