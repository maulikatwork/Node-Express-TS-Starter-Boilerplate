import express from 'express';
import baseRouter from '../modules/baseModule/base.routes';

const routersVersionOne = express.Router();

// Base router
routersVersionOne.use('/base', baseRouter);

// Basic routes can be added here
// Example:
// routersVersionOne.use('/example', exampleRouter);

export default routersVersionOne;
