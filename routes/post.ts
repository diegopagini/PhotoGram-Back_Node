/** @format */

import { Response, Router } from 'express';
import { FileUpload } from '../interfaces/file-upload.interface';
import { checkToken } from '../middlewares/auth';
import { Post } from '../models/post.model';
import FileSystem from '../classes/files-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

// Crear post
postRoutes.post('/', [checkToken], (req: any, resp: Response) => {
	const body = req.body;
	body.user = req.user._id;
	const images: string[] = fileSystem.moveImagesFromTempToPost(req.user._id);
	body.img = images;

	Post.create(body)
		.then(async (postDB: any) => {
			await postDB.populate('user', '-password').execPopulate();

			resp.json({
				ok: true,
				post: postDB,
			});
		})
		.catch((err) => {
			resp.json(err);
		});
});

// Obtener posts paginados
postRoutes.get('/', async (req: any, resp: Response) => {
	let page: number = Number(req.query.page) || 1;
	let skip = page - 1;
	skip = skip * 10;

	const posts = await Post.find()
		.sort({ _id: -1 })
		.skip(skip)
		.limit(10)
		.populate('user', '-password')
		.exec();

	resp.json({
		ok: true,
		page,
		posts,
	});
});

// Servicio para subir archivos
postRoutes.post('/upload', [checkToken], async (req: any, resp: Response) => {
	if (!req.files) {
		return resp.status(400).json({
			ok: false,
			message: 'No se subió ningun archivo',
		});
	}

	const file: FileUpload = req.files.image;

	if (!file) {
		return resp.status(400).json({
			ok: false,
			message: 'No se subió ningun archivo - imagen',
		});
	}

	if (!file.mimetype.includes('image')) {
		return resp.status(400).json({
			ok: false,
			message: 'No se subió una imagen',
		});
	}

	await fileSystem.saveTemporalImage(file, req.user._id);

	resp.json({
		ok: true,
		file: file.mimetype,
	});
});

// Mostrar imagenes
postRoutes.get('imagen/:userid/:img', (req: any, resp: Response) => {
	const userId = req.params.userid;
	const img = req.params.img;
	const pathPhoto = fileSystem.getPhotoByUrl(userId, img);

	resp.sendFile(pathPhoto);
});

export default postRoutes;
