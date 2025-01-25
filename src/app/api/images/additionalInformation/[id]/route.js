import MainImage from "../../../../models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, notFoundResponse, serverErrorResponse } from "@/app/helpers/apiResponseHelpers";
import { promises as fs } from "fs";
import path from "path";

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const formData = await request.json();
        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found', null);
        }

        const filePathToDelete = formData.filePath;
        let additionalInformationDir = path.join(process.cwd(), 'public', filePathToDelete);

        try {
            await fs.unlink(additionalInformationDir);

            try {
                await fs.access(additionalInformationDir);
                return serverErrorResponse('Failed to delete the file from the filesystem.');
            } catch (accessError) {
                console.log('File successfully deleted from filesystem.');
            }

        } catch (fileError) {
            console.error(`Error deleting file from filesystem:`, fileError);
            return serverErrorResponse('Failed to delete the file from the filesystem.');
        }

        await MainImage.findByIdAndUpdate(
            id,
            { $pull: { additionalInformation: filePathToDelete } }
        );

        const updatedImage = await MainImage.findById(id);
        const isFileStillPresent = updatedImage.additionalInformation.includes(filePathToDelete);

        if (isFileStillPresent) {
            return serverErrorResponse('Failed to remove the file path from the database.');
        }

        return successResponse('Your image and its associated file have been deleted successfully.', null);
    } catch (error) {
        console.error('An error occurred while processing the request:', error);
        return serverErrorResponse('Internal Server Error. Please try again later!');
    }
}