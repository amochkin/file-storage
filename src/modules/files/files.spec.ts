import * as fs from 'fs';
import { Test } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import * as path from 'path';

const validFileId = '1a2b3c4d5e6f7890';
const invalidFileId = '1a2b3c4d5e6f7890Z';
const uploadDir = '/tmp';

process.env.FILES_UPLOAD_DIR = uploadDir;

describe('Files', () => {
	let controller: FilesController;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let service: FilesService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [],
			controllers: [FilesController],
			providers: [FilesService],
		}).compile();

		controller = module.get<FilesController>(FilesController);
		service = module.get<FilesService>(FilesService);
	});

	jest.spyOn(fs, 'existsSync').mockImplementation((filePath: string) => {
		if (filePath.includes(validFileId)) {
			const fileId = path.basename(filePath, '.json');
			// eslint-disable-next-line no-console
			console.debug('existsSync', fileId);
			return fileId === validFileId;
		} else {
			return fs.existsSync(filePath);
		}
	});

	jest.spyOn(fs, 'readFileSync').mockImplementation(() => null);

	it('malformed id', async () => {
		await expect(controller.getFile(<never>{}, { id: invalidFileId }, { thumb: 0 })).rejects.toThrowError();
	});

	// it('retrieve a file', async () => {
	// 	const result = [];
	// 	const fileStream = await controller.getFile(result, { id: validFileId }, { thumb: 0 });
	//
	// 	expect(fileStream).toBeInstanceOf(StreamableFile);
	// });
});
