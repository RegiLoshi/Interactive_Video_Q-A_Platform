import prismaClient from "../config/prismaClient.js"

const getSurveys = async (req, res) => {
    try { 
        const surveys = await prismaClient.survey.findMany({
            include: {
                questions: true,
                author: {
                    select: {
                        name: true,
                        last_name: true,
                        user_id: true
                    }
                }
            }
        });
        return res.status(200).json(surveys); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while fetching users"
        });
    }
};

const addSurvey = async (req, res) => {
    const {title, description, questions, authorId} = req.body;
    
    try { 
        const survey = await prismaClient.survey.create({
            data: {
                title: title,
                description: description,
                authorId: authorId,
                questions: {
                    create: questions.map(q => ({
                        title: q.text,
                        category: q.category,
                        authorId: authorId
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        answer: true
                    }
                }
            }
        });

        return res.status(201).json(survey); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating survey"
        });
    }
}

export default {getSurveys, addSurvey};