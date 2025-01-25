require('dotenv').config({ path:`${process.env.PWD}/.env`})
const path = require("path");
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const AppError = require('./utils/appError');
// Route imports
const authRouter = require('./routes/jwtRouter');
// Max session age
const maxSessionAge = 1000 * 60 * 60 * 24 * 1 // One day

const corsOptions = {
    origin: ['http://frontend:3000','http://localhost:3000','http://localhost:80'],
    credentials: true
}

const app = express()
    .use(helmet())
    .use(bodyParser.json())
    .use(cookieParser())
    .use(
        cookieSession({
            name:'Pantheon',
            maxAge:maxSessionAge,
            keys:[process.env.SESSION_SECRET],
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })
    );
app.use(cors())
app.use((req,res,next) => {
    res.send('Server started');
    res.end();
});
app.get('/check-session',(req,res) => {
    res.json(req.session)
});

app.use('/auth',authRouter);

// Error handler
app.use((err, req, res, next) => {
    if (err instanceof AppError) {
      // AppError will contain a specific status code and custom message
      const statusCode = err.statusCode || 500;
      const errorMessage = err.message;
  
      res.status(statusCode).send({
        title: errorText.docusignApiError,
        description: `<b>Status code: ${statusCode}</b><br></br>${errorMessage}`,
      });
    } else if (err && err.response && err.response.body) {
      // Docusign API specific error, extract error code and message
      const statusCode = 500;
      const errorBody = err && err.response && err.response.body;
      const errorCode = errorBody && errorBody.errorCode;
      const errorMessage = errorBody && errorBody.message;
  
      res.status(statusCode).send({
        title: errorText.docusignApiError,
        description: `<b>Status code: ${statusCode}</b><br></br>${errorCode}: ${errorMessage}`,
      });
    } else {
      console.log('Unknown error occurred.');
      console.log(err);
  
      res.status(500).send({
        title: errorText.docusignApiError,
        description: `<b>Status code: ${statusCode}</b><br></br>${errorText.unknownError}`,
      });
    }
  });

  // Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    console.log('Serving static assets from:', path.join(__dirname, 'assets', 'public'));
    app.use('/assets', express.static(path.join(__dirname, 'assets', 'public')));
  }
  
  
  
  
  const port = process.env.PORT_NUMBER;
  console.log('port on server', port)
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started and listening on port ${port}`);
  });