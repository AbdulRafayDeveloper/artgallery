import MainImage from "@/app/models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, serverErrorResponse, conflictResponse, notFoundResponse } from "@/app/helpers/apiResponseHelpers";
import * as helper from "@/app/helpers/apiHelpers";

export async function POST(request) {
    try {
        await connectDB();
        const formData = await request.formData();
        const values = await helper.handleNestedObjects(helper.parseFormData(formData));
        const { object: { subjectTitle: title }, location: { lastKnow: lastKnowLocation } } = values;
        const formattedDate = helper.getCurrentDateFormatted();

        const folderName = `${values.attribution[0].authorDates.birthCity}-${values.object.century}th c`;
        const { artistFolderPath, imageFolderPath, mainImageName, folderPathForImage, photographsFolderPath } = helper.createFolderStructure(
            folderName, values.attribution?.[0]?.author, title, lastKnowLocation, formattedDate
        );

        const savedImageNames = await helper.photographsSave(values.photographs, photographsFolderPath);

        values.photographs = values.photographs.map((photo, index) => ({
            ...photo,
            images: savedImageNames[index]
        }));

        if (artistFolderPath === null && imageFolderPath === null && mainImageName === null && folderPathForImage === null) {
            return serverErrorResponse('Author Name must contain first name and last name not only contains single word!');
        }

        const thumbnailPath = await helper.saveThumbnail(formData.get("thumbnail"), mainImageName, artistFolderPath);
        values.thumbnail = thumbnailPath.replace(/\\/g, '/');
        values.additionalInformation = await helper.saveAdditionalFiles(formData, imageFolderPath);

        const project = new MainImage({
            ...values,
            additionalInformation: values.additionalInformation || [],
            thumbnail: values.thumbnail,
            folderPathForImage: folderPathForImage,
            folderNameForImage: mainImageName
        });

        const saveProject = await project.save();

        if (!saveProject) {
            return serverErrorResponse('Submission failed. Please try again later.');
        }

        return successResponse('Successfull Entry', saveProject);
    } catch (error) {
        console.error("Error: ", error);
        return serverErrorResponse('Internal Server Error. Please try again Later!');
    }
}

export async function GET(req) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('limit')) || 15;
        const searchQuery = url.searchParams.get('search') || '';

        let query = {};

        if (searchQuery) {
            query["object.subjectTitle"] = { $regex: searchQuery, $options: 'i' };
        }

        const totalRecords = await MainImage.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / pageSize);
        const skip = (page - 1) * pageSize;
        const projects = await MainImage.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize);

        if (!projects || projects.length === 0) {
            return notFoundResponse('No records found.', null);
        }

        return successResponse('Records fetched successfully.', {
            records: projects,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return serverErrorResponse('Internal Server Error. Please try again Later!');
    }
}
