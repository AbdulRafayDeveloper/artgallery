import fs from "fs";
import path from "path";
import fsPromises from 'fs/promises';

export const getCurrentDateFormatted = () => {
    const today = new Date();
    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('');
};

export const getRandomNumber = (min = 1, max = 10000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const parseFormData = (formData) => {
    const result = {};

    for (const [key, value] of formData.entries()) {
        const keys = key.split(/[\[\]]+/).filter(Boolean);
        keys.reduce((obj, k, i) => {
            if (i === keys.length - 1) {
                obj[k] = value;
            } else {
                obj[k] = obj[k] || {};
            }
            return obj[k];
        }, result);
    }

    return result;
};

export const parseFormDataWihoutEntries = (formData) => {
    const result = {};

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const keys = key.split(/[\[\]]+/).filter(Boolean);
            keys.reduce((obj, k, i) => {
                if (i === keys.length - 1) {
                    obj[k] = formData[key];
                } else {
                    obj[k] = obj[k] || {};
                }
                return obj[k];
            }, result);
        }
    }

    return result;
};


export const safeParseJSON = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

export const handleNestedObjects = async (obj) => {
    for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
                obj[key] = await Promise.all(obj[key].map(item => handleNestedObjects(item)));
            } else {
                if (key === 'dating' || key === 'dimensions' || key === 'authorDates') {
                    obj[key] = safeParseJSON(obj[key]);
                }
                obj[key] = await handleNestedObjects(obj[key]);
            }
        }
    }

    const convertObjectToArray = (key) => {
        if (obj[key] && typeof obj[key] === 'object') {
            obj[key] = Object.values(obj[key]);
        }
    };

    convertObjectToArray('attribution');
    convertObjectToArray('provenance');
    convertObjectToArray('bibliography');
    convertObjectToArray('exhibition');
    convertObjectToArray('photographs');

    return obj;
};

export const saveThumbnail = async (thumbnail, mainImageName, artistFolderPath) => {
    if (thumbnail) {
        const baseDir = path.join(process.cwd(), 'public/images');
        const thumbnailFilename = `${mainImageName}${path.extname(thumbnail.name)}`;
        const thumbnailPath = path.join(artistFolderPath, thumbnailFilename);
        await fs.promises.mkdir(artistFolderPath, { recursive: true });
        await fs.promises.writeFile(thumbnailPath, Buffer.from(await thumbnail.arrayBuffer()));
        const relativePath = path.relative(baseDir, thumbnailPath);
        return `/images/${path.posix.join(relativePath)}`;
    }
    return null;
};

// client ko base path change kerwana ha
export const saveAdditionalFiles = async (formData, imageFolderPath) => {
    const basePath = path.resolve('D:/Github Projects/art-gallery/public');

    return Promise.all(
        Array.from(formData.entries())
            .filter(([key]) => key.startsWith('additionalInformation'))
            .map(async ([key, file]) => {
                const imageName = path.basename(file.name);
                const fullPath = path.join(imageFolderPath, imageName);

                await fs.promises.writeFile(
                    fullPath,
                    Buffer.from(await file.arrayBuffer())
                );

                const normalizedBasePath = path.normalize(basePath);
                const normalizedFullPath = path.normalize(fullPath);
                let relativePath = path.relative(normalizedBasePath, normalizedFullPath).replace(/\\/g, '/');
                relativePath = "/" + relativePath
                return relativePath;
            })
    );
};

export const createFolderStructure = (folderName, artistName, title, lastKnowLocation, formattedDate) => {
    const projectDir = path.join(process.cwd(), "public/images");
    const folderPath = path.join(projectDir, folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    if (!artistName) {
        return { artistFolderPath: folderPath, imageFolderPath: folderPath, mainImageName: null };
    }

    const [firstName, lastName] = artistName.split(' ', 2);

    if (!(firstName && lastName)) {
        return { artistFolderPath: null, imageFolderPath: null, mainImageName: null, folderPathForImage: null };
    }

    const artistFolderPath = path.join(folderPath, `${lastName}, ${firstName}`);
    const folderPathForImage = `${folderName}/${lastName}, ${firstName}`;

    if (!fs.existsSync(artistFolderPath)) {
        fs.mkdirSync(artistFolderPath, { recursive: true });
    }

    const mainImageName = `${lastName.slice(0, 3)}${firstName.slice(0, 2)}${getRandomNumber()}-${lastName}-${title}, ${lastKnowLocation}-${formattedDate}`;
    const imageFolderPath = path.join(artistFolderPath, mainImageName);

    if (!fs.existsSync(imageFolderPath)) {
        fs.mkdirSync(imageFolderPath, { recursive: true });
    }

    const photographsFolderPath = path.join(imageFolderPath, 'photographs');
    if (!fs.existsSync(photographsFolderPath)) {
        fs.mkdirSync(photographsFolderPath, { recursive: true });
    }

    return { artistFolderPath, imageFolderPath, mainImageName, folderPathForImage, photographsFolderPath };
};

export const photographsSave = async (photographs, photographsFolderPath) => {
    // Initialize an array of empty arrays, one for each photograph index
    const savedImageNames = photographs.map(() => []);

    const publicFolder = 'public';

    for (const [index, photo] of photographs.entries()) {
        const photographFolderPath = path.join(photographsFolderPath, `photograph_${index}`);

        if (!fs.existsSync(photographFolderPath)) {
            fs.mkdirSync(photographFolderPath, { recursive: true });
        }

        const imagesArray = Object.values(photo.images || {});

        await Promise.all(imagesArray.map(async (file) => {
            if (file && file.name) {
                const filePath = path.join(photographFolderPath, file.name);
                try {
                    console.log("Saving file at path:", filePath);
                    const buffer = Buffer.from(await file.arrayBuffer());
                    await fs.promises.writeFile(filePath, buffer);

                    // Get relative path after 'public'
                    const publicIndex = filePath.indexOf(publicFolder);
                    let relativePath = filePath.substring(publicIndex + publicFolder.length + 1).replace(/\\/g, '/');
                    relativePath = "/" + relativePath;  // Ensure path starts with '/'

                    // Store the image path in the corresponding index
                    savedImageNames[index].push(relativePath);
                } catch (err) {
                    console.error(`Failed to save file ${file.name}:`, err);
                }
            }
        }));
    }

    return savedImageNames;
};

export async function photographsSaveForUpdate(photographs, existingProject) {
    const baseDir = path.join(process.cwd(), 'public');
    const stringImagesArray = [];
    const fileImagesArray = [];
    const processedPhotographs = [];

    photographs.forEach((photo, index) => {
        const imagesArray = [];
        const imageKeys = Object.keys(photo.images);

        imageKeys.forEach(key => {
            const image = photo.images[key];

            if (typeof image === 'object' && image instanceof File) {
                fileImagesArray.push({ index, key, image });
            } else if (typeof image === 'string') {
                stringImagesArray.push({ index, key, image });
            }
        });

        processedPhotographs.push({
            images: imagesArray,
            date: photo.date || null,
            location: photo.location || '',
            photographerName: photo.photographerName || ''
        });
    });

    if (fileImagesArray.length > 0) {
        const path1 = existingProject.folderPathForImage;
        const path2 = existingProject.folderNameForImage;

        for (const fileImage of fileImagesArray) {
            const { index } = fileImage;
            const folderToDelete = path.join(baseDir, "images", path1, path2, 'photographs', `photograph_${index}`);

            try {
                await fs.promises.access(folderToDelete);
                await fs.promises.rm(folderToDelete, { recursive: true, force: true });
            } catch (accessError) {
                // console.log(`Folder photograph_${index} does not exist or failed to delete:`, accessError);
            }
        }

        for (const fileImage of fileImagesArray) {
            const { index, image } = fileImage;
            const baseFolderPath = path.join(baseDir, "images", path1, path2, 'photographs');
            const folderToCreate = path.join(baseFolderPath, `photograph_${index}`);

            try {
                await fs.promises.access(folderToCreate);
            } catch (accessError) {
                fsPromises.mkdir(folderToCreate, { recursive: true });
            }

            const filePath = path.join(folderToCreate, image.name);
            const buffer = Buffer.from(await image.arrayBuffer());

            if (buffer) {
                await fs.promises.writeFile(filePath, buffer);
                processedPhotographs[index].images.push(filePath.replace(baseDir, '').replace(/\\/g, '/'));
            } else {
                console.error('File buffer is missing:', image);
            }
        }
    }

    stringImagesArray.forEach(image => {
        processedPhotographs[image.index].images.push(image.image);
    });

    return processedPhotographs;
}

export const saveThumbnailForUpdate = async (thumbnail, folderPathForImage, thumbnailPath) => {
    if (thumbnail) {
        const baseDir = path.join(process.cwd(), 'public/images', folderPathForImage);
        const thumbnailFilename = `${path.basename(thumbnailPath, path.extname(thumbnailPath))}${path.extname(thumbnail.name)}`;
        const finalThumbnailPath = path.join(baseDir, thumbnailFilename);

        try {
            try {
                await fsPromises.stat(baseDir);
                console.log("Target directory already exists.");
            } catch (error) {
                if (error.code === 'ENOENT') {
                    console.log("Target directory does not exist, creating now.");
                    await fsPromises.mkdir(baseDir, { recursive: true });
                } else {
                    throw error;
                }
            }

            await fsPromises.writeFile(finalThumbnailPath, Buffer.from(await thumbnail.arrayBuffer()));
            const relativePath = path.relative(path.join(process.cwd(), 'public/images'), finalThumbnailPath);
            return `/images/${path.posix.join(relativePath)}`;
        } catch (error) {
            console.error('Error saving the thumbnail:', error);
            throw error;
        }
    }
    return null;
};

export const saveAdditionalFilesForUpdate = async (formData, folderPathForImage, folderNameForImage) => {
    const basePath = path.resolve('D:/Github Projects/art-gallery/public/images');

    return Promise.all(
        Array.from(formData.entries())
            .filter(([key]) => key.startsWith('additionalInformation'))
            .map(async ([key, file]) => {
                const imageName = path.basename(file.name);
                const fullPath = path.join(basePath, folderPathForImage, folderNameForImage, imageName);

                await fs.promises.writeFile(
                    fullPath,
                    Buffer.from(await file.arrayBuffer())
                );

                const normalizedBasePath = path.normalize(basePath);
                const normalizedFullPath = path.normalize(fullPath);
                let relativePath = path.relative(normalizedBasePath, normalizedFullPath).replace(/\\/g, '/');
                relativePath = "/images/" + relativePath
                return relativePath;
            })
    );
};
