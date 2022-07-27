const express = require('express');
const app = express();
app.use(express.static('./public'));
require('express-async-errors');
const {connectDatabase} = require('./db/connect');
const {creatorRouter} = require('./routes/creatorRoute')
const {businessRouter} = require('./routes/businessRoute')
const {transactionRouter} = require('./routes/transactionRoute')
const {loginRouter} = require('./routes/loginRoute')
const {notFound} = require('./middlewares/notFound')
const {errorHandlerMiddleware} = require('./middlewares/errorHandler')

const {approveTransaction, creatorInvoice, searchTransactions, apiDocumentation} = require('./controllers/transactionControllers')
//
app.use(express.json());
app.use('/login', loginRouter)
app.use('/creator', creatorRouter)
app.use('/transaction', transactionRouter)
app.use('/business', businessRouter)
app.use('/approve-transaction', approveTransaction)
app.use('/creator-invoice', creatorInvoice)
app.use('/search-transactions', searchTransactions)
app.use('/api-documentation', apiDocumentation)


app.use(notFound)
app.use(errorHandlerMiddleware)



const PORT = process.env.PORT || 8080;
const URL = `mongodb+srv://user1:helloworld123$@socialpaycluster.fsdxzis.mongodb.net/socialPayDatabase?retryWrites=true&w=majority`
const startApp = async () => {
    try {
      await connectDatabase(URL);
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
startApp();