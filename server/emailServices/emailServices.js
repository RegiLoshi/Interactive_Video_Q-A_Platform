import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};


const templates = {
  passwordReset: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style type="text/css">
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4e73df;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 4px 4px 0 0;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #4e73df;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hello {{name}},</p>
            <p>We received a request to reset your password. If you made this request, please click the button below to reset your password.</p>
            <div style="text-align: center;">
                <a href="{{link}}" class="button">Reset Password</a>
            </div>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>Thanks,<br>The Support Team</p>
        </div>
        <div class="footer">
            <p>If you're having trouble clicking the button, copy and paste the following URL into your web browser: {{link}}</p>
        </div>
    </div>
</body>
</html>
  `,
  surveyAnswer: `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Survey Answer</title>
    <style type="text/css">
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {  
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header      {
            background-color: #4e73df;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 4px 4px 0 0;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .button  {
            display: inline-block;
            background-color: #4e73df;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>SurveyHub</h2>
        </div>
        <div class="content">
            <p>Hello {{asker}},</p>
            <p>The survey: "{{surveyName}}" has a new answer.</p>
            <p>Please check the survey to view the answer.</p>
            <p>Thanks,<br>The Support Team</p>
        </div>
    </div>
</body>
</html>
  ` 
};


const sendEmail = async (to, subject, templateData, templateName, asker = '', surveyName = '') => {
  try {
    const transporter = createTransporter();
    
    const templateString = templates[templateName];
    if (templateName === 'surveyAnswer') {
      templateData.asker = asker;
      templateData.surveyName = surveyName;
    }
    if (!templateString) {
      throw new Error(`Template "${templateName}" not found`);
    }
    
    const template = handlebars.compile(templateString);
    const htmlContent = template(templateData);


    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };
    

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;