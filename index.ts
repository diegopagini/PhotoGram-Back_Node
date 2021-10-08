/** @format */

import Server from './classes/server';
import userRoutes from './routes/user';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileUpload({ useTempFiles: true }));

// Cors
server.app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

// Rutas de la app
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

// Conectar DB
mongoose.connect('mongodb://localhost:27017/photosgram', {}, (err) => {
	if (err) throw err;

	console.log('Base de datos Online');
});

// Levantar Express
server.start(() => {
	console.log(`Servidor corriendo en puerto: ${server.port}`);
});
