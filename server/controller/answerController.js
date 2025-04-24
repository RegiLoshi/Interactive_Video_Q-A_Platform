import prismaClient from "../config/prismaClient.js"
import { Readable } from 'stream';
import {google} from "googleapis"
import sendEmail from "../emailServices/emailServices.js";
const oauth2client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN});
const drive = google.drive({
  version: 'v3',
  auth: oauth2client
});

const addAnswer = async (req, res) => {
    const answers = JSON.parse(req.body.answers);
    const video = req.file;

    try {
        if(video){
            const stream = Readable.from(video.buffer);

            const response = await drive.files.create({
                requestBody: {
                    name: video.originalname,
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
                    mimeType: video.mimetype,
                },
                media: {
                    mimeType: video.mimetype,
                    body: stream
                },
                fields: 'id, name, webViewLink, webContentLink'
            });

            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            const file = await drive.files.get({
                fileId: response.data.id,
                fields: 'webViewLink, webContentLink'
            });

            const videoUrl = file.data.webViewLink || file.data.webContentLink;

            if (!videoUrl) {
                throw new Error('No video URL received from Google Drive');
            }

            const createdVideoAnswer = await prismaClient.survey_Video.create({
                data: {
                    question_link: videoUrl,
                    surveyId: answers[0].surveyId,
                    uploaderId: answers[0].authorId
                }
            });
        }
        const createdAnswers = await prismaClient.answer.createMany({
            data: answers
        });
        const survey = await prismaClient.survey.findUnique({
            where: {
                survey_id: answers[0].surveyId
            },
            include: {
                author: {
                    select: {
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!survey) {
            throw new Error('Survey not found');
        }


        const emailResult = await sendEmail(
            survey.author.email,
            "New Survey Answer",
            createdAnswers,
            "surveyAnswer",
            survey.author.name,
            survey.title,
        );
        console.log(emailResult);
        return res.status(201).json({createdAnswers});
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({
            message: "Error creating answer"
        });
    }
}

const getAnswers = async (req, res) => { 
    console.log(req.params)
    const {id} = req.params;
    try {
        const uniqueUsers = await prismaClient.answer.findMany({
            where: {
                surveyId: id,
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

const getVideoAnswer = async (req, res) => {
    const {surveyId, userId} = req.params;
    try {
        const videoAnswer = await prismaClient.survey_Video.findFirst({
            where: {
                surveyId: surveyId,
                uploaderId: userId
            }
        });
        const videoUrl = videoAnswer?.question_link
        return res.status(200).json(videoUrl);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching video answer"
        });
    }
}

export default { addAnswer,getAnswers, getVideoAnswer};
