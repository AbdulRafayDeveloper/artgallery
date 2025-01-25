import MainImage from "@/app/Models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, notFoundResponse, serverErrorResponse } from "@/app/helpers/apiResponseHelpers";
import * as helper from "@/app/helpers/apiHelpers";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const [id, attributionId] = params.params;

        if (!id) {
            return notFoundResponse('Image ID is required.', null);
        }

        if (!attributionId) {
            return notFoundResponse('Attribution ID is required.', null);
        }

        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found.', null);
        }

        const matchedAttribution = image.attribution.find(
            (attr) => attr._id.toString() === attributionId
        );

        if (!matchedAttribution) {
            return notFoundResponse('Attribution not found.', null);
        }

        return successResponse('Records fetched successfully.', {
            records: {
                ...image.toObject(),
                attribution: matchedAttribution,
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse('Internal Server Error. Please try again later.');
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const [id, attributionId] = params.params;
        const formData = await req.json();
        const values = await helper.handleNestedObjects(helper.parseFormDataWihoutEntries(formData));

        if (!id) {
            return notFoundResponse('Image ID is required.', null);
        }

        if (!attributionId) {
            return notFoundResponse('Attribution ID is required.', null);
        }

        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found.', null);
        }

        if (!Array.isArray(image.attribution)) {
            return notFoundResponse('No attributions found for this image.', null);
        }

        const attributionIndex = image.attribution.findIndex(attr => attr._id.toString() === attributionId);

        if (attributionIndex === -1) {
            return notFoundResponse('Attribution not found.', null);
        }

        if (values.attribution && values.attribution[0]) {
            image.attribution[attributionIndex].author = values.attribution[0].author || image.attribution[attributionIndex].author;
            image.attribution[attributionIndex].school = values.attribution[0].school || image.attribution[attributionIndex].school;
            image.attribution[attributionIndex].centuryOfActivity = values.attribution[0].centuryOfActivity || image.attribution[attributionIndex].centuryOfActivity;
            image.attribution[attributionIndex].authorDates.birthYear = values.attribution[0].authorDates.birthYear || image.attribution[attributionIndex].authorDates.birthYear;
            image.attribution[attributionIndex].authorDates.deathYear = values.attribution[0].authorDates.deathYear || image.attribution[attributionIndex].authorDates.deathYear;
            image.attribution[attributionIndex].authorDates.birthCity = values.attribution[0].authorDates.birthCity || image.attribution[attributionIndex].authorDates.birthCity;
            image.attribution[attributionIndex].authorDates.deathCity = values.attribution[0].authorDates.deathCity || image.attribution[attributionIndex].authorDates.deathCity;
        }

        const updatedImage = await image.save();

        if (!updatedImage) {
            return notFoundResponse('Failed to update image.', null);
        }

        return successResponse('Attribution updated successfully.', updatedImage);
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse('Internal Server Error. Please try again later.');
    }
}