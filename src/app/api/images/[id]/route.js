import MainImage from "../../../models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, notFoundResponse, serverErrorResponse } from "@/app/helpers/apiResponseHelpers";
import { promises as fs } from "fs";
import path from "path";
import { Parser } from 'json2csv';
import * as helper from "@/app/helpers/apiHelpers";

export async function GET(req) {
    try {
        await connectDB();
        const images = await MainImage.find({});

        if (images.length === 0) {
            return serverErrorResponse('No records found for CSV generation.');
        }

        const fields = [
            'object.subjectTitle',
            'object.type',
            'object.century',
            'object.medium',
            'object.dimensions.width',
            'object.dimensions.height',
            'location.lastKnow',
            'location.type',
            'location.dateIn',
            'createdAt'
        ];

        const parser = new Parser({ fields });

        const csvData = images.map(image => ({
            'object.subjectTitle': image.object?.subjectTitle || '',
            'object.type': image.object?.type || '',
            'object.century': image.object?.century || '',
            'object.medium': image.object?.medium || '',
            'object.dimensions.width': image.object?.dimensions.width || '',
            'object.dimensions.height': image.object?.dimensions.height || '',
            'location.lastKnow': image.location?.lastKnow || '',
            'location.type': image.location?.type || '',
            'location.dateIn': image.location?.dateIn || '',
            createdAt: image.createdAt?.toISOString() || ''
        }));

        const csv = parser.parse(csvData);

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="Total_Images_Records.csv"`,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return serverErrorResponse('Internal Server Error. Please try again later.');
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found', null);
        }

        let imageDir = path.join(process.cwd(), 'public/images', image.folderPathForImage, image.folderNameForImage);

        try {
            await fs.rmdir(imageDir, { recursive: true });
        } catch (dirError) {
            console.error(`Error deleting project directory ${imageDir} from filesystem:`, dirError);
            return serverErrorResponse('Failed to delete project directory from filesystem.');
        }

        await MainImage.deleteOne({ _id: id });
        const deletedImage = await MainImage.findById(id);

        if (deletedImage) {
            return serverErrorResponse('Failed to delete image from database.');
        }

        return successResponse('Your image and its associated directory have been deleted successfully.', null);
    } catch (error) {
        console.error('An error occurred while processing the request:', error);
        return serverErrorResponse('Internal Server Error. Please try again later!');
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const formData = await request.formData();
        const values = await helper.handleNestedObjects(helper.parseFormData(formData));
        let existingProject = await MainImage.findOne({ _id: id });

        if (formData.get("thumbnail")) {
            const thumbnailPath = path.join(process.cwd(), 'public', existingProject.thumbnail);

            try {
                await fs.access(thumbnailPath);

                try {
                    await fs.unlink(thumbnailPath);
                    console.log('File successfully deleted from filesystem.');

                    try {
                        await fs.access(thumbnailPath);
                        console.log('Failed to delete the file from the filesystem.');
                        return serverErrorResponse('Failed to delete the file from the filesystem.');
                    } catch (verifyError) {
                        console.log('File successfully deleted from filesystem.');
                    }

                } catch (fileError) {
                    console.error('Error deleting file from filesystem:', fileError);
                    return serverErrorResponse('Failed to delete the file from the filesystem.');
                }
            } catch (accessError) {
                console.log("File does not exist. ", thumbnailPath);
            }

            const thumbnailPathSave = await helper.saveThumbnailForUpdate(formData.get("thumbnail"), existingProject.folderPathForImage, thumbnailPath);
            values.thumbnail = thumbnailPathSave.replace(/\\/g, '/');
        }

        const photographs = await helper.photographsSaveForUpdate(values.photographs, existingProject);

        const newAdditionalFiles = await helper.saveAdditionalFilesForUpdate(
            formData,
            existingProject.folderPathForImage,
            existingProject.folderNameForImage
        );

        if (!Array.isArray(existingProject.additionalInformation)) {
            existingProject.additionalInformation = [];
        }

        if (newAdditionalFiles && Array.isArray(newAdditionalFiles)) {
            newAdditionalFiles.forEach(filePath => {
                const fileExists = existingProject.additionalInformation.includes(filePath);

                if (!fileExists) {
                    existingProject.additionalInformation.push(filePath);
                }
            });
        }

        existingProject = {
            ...existingProject.toObject(),
            ...values,
            thumbnail: values.thumbnail || existingProject.thumbnail,
            folderPathForImage: existingProject.folderPathForImage,
            folderNameForImage: existingProject.folderNameForImage,
            additionalInformation: existingProject.additionalInformation,
            photographs: photographs
        };

        const updatedProject = await MainImage.findByIdAndUpdate(existingProject._id, existingProject, { new: true });

        if (!updatedProject) {
            return serverErrorResponse('Update failed. Please try again later.');
        }

        return successResponse('Your record has been updated successfully.', updatedProject);
    } catch (error) {
        // console.error("Error: ", error);
        return serverErrorResponse('Internal Server Error. Please try again later!');
    }
}
