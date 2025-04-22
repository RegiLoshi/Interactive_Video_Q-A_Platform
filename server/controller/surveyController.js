import prismaClient from "../config/prismaClient.js"

const getSurveys = async (req, res) => {
    try { 
        const surveys = await prismaClient.survey.findMany({
            include: {
                questions: {
                    select:{
                        question_id: true,
                        answers: true,
                        title: true,
                        category: true,
                    }
                },
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
        console.error('Error fetching surveys:', error);
        return res.status(500).json({
            message: "Error fetching surveys"
        });
    }
};

const addSurvey = async (req, res) => {
    const {title, description, questions, authorId} = req.body;
    if(authorId != req.user.user_id)
    return res.status(403).json({
        message: "Not authorized"
    });
    
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
        });

        return res.status(201).json(survey); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error creating survey"
        });
    }
}

const deleteSurvey = async (req,res) => {
    const {surveyId, userId} = req.body;
    if(userId != req.user.user_id)
    return res.status(403).json({
        message: "Not authorized"
    });
    try { 
        await prismaClient.survey.delete({
            where:{
                survey_id: surveyId,
                authorId: userId
            }
        })
        return res.status(200).json({ message: "Survey deleted successfully" }); 
    } catch (error) {
        console.error('Error deleting survey:', error);
        return res.status(500).json({
            message: "Error deleting survey"
        });
    }
}

const getSurveysID = async (req,res) => {
    const {id} = req.params;
    try {
        const survey = await prismaClient.survey.findUnique({
            where: {survey_id: id},
            include: {
                author: true,
                questions: {
                    include: {
                        answers: true
                    }
                },
                surveyVideos: true
            }
        });
        return res.status(200).json(survey);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error while fetching users"
        });
    }
}   



export default {getSurveys, addSurvey, deleteSurvey,getSurveysID};