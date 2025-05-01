import e from "cors";
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
    let existingSurvey;
    try { 
        if(req.user.role != 'ADMIN'){
        existingSurvey = await prismaClient.survey.findUnique({
            where: {
                survey_id: surveyId,
                authorId: userId
            }
        });
    }else{
        existingSurvey = await prismaClient.survey.findUnique({
            where: {
                survey_id: surveyId
            }
        });
    }

        if (!existingSurvey) {
            return res.status(404).json({
                message: "Survey not found or you don't have permission to delete it"
            });
        }
        if(req.user.role != 'ADMIN'){
            await prismaClient.survey.delete({
                where:{
                    survey_id: surveyId,
                    authorId: userId
                }
            })
        }else{
            await prismaClient.survey.delete({
                where:{
                    survey_id: surveyId
                }
            })
        }
        return res.status(200).json({ message: "Survey deleted successfully" }); 
    } catch (error) {
        console.error('Error deleting survey:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                message: "Survey not found or you don't have permission to delete it"
            });
        }
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

const getSurveyPagination = async (req, res) => {
    const {limit, offset} = req.params;
    try {
        const [surveys, total] = await Promise.all([
            prismaClient.survey.findMany({
                skip: parseInt(offset),
                take: parseInt(limit),
                include: {
                    questions: {
                        select: {
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
                },
                orderBy: {
                    created_at: 'desc'
                }
            }),
            prismaClient.survey.count()
        ]);

        return res.status(200).json({
            surveys,
            total
        });
    } catch (error) {
        console.error('Error fetching paginated surveys:', error);
        return res.status(500).json({
            message: "Error fetching paginated surveys"
        });
    }
}

const getSurveyPaginationUser = async(req, res) => {
    const {limit, offset, userId} = req.params;
    try {
        const [surveys, total] = await Promise.all([
            prismaClient.survey.findMany({
                where: {
                    authorId: userId
                },
                skip: parseInt(offset),
                take: parseInt(limit),
                include: {
                    questions: {
                        select: {
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
                },
                orderBy: {
                    created_at: 'desc'
                }
            }),
            prismaClient.survey.count({
                where: {
                    authorId: userId
                }
            })
        ]);

        return res.status(200).json({
            surveys,
            total
        });
    } catch (error) {
        console.error('Error fetching user paginated surveys:', error);
        return res.status(500).json({
            message: "Error fetching user paginated surveys"
        });
    }
}



export default {getSurveys, addSurvey, deleteSurvey,getSurveysID, getSurveyPagination, getSurveyPaginationUser};