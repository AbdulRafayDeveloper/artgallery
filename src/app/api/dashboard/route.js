import MainImage from "../../models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, serverErrorResponse } from "@/app/helpers/apiResponseHelpers";

export async function GET(req) {
    try {
        await connectDB();

        const images = await MainImage.find({});
        const totalCount = images.length;

        const typeCounts = {
            Painting: 0,
            Fresco: 0,
            Sculpture: 0,
            Drawing: 0
        };

        const photographerSet = new Set();
        const authorSet = new Set();

        images.forEach(image => {
            const type = image.object?.type;
            if (typeCounts[type] !== undefined) {
                typeCounts[type]++;
            }

            if (image.photographs?.length) {
                image.photographs.forEach(photo => {
                    if (photo.photographerName) {
                        photographerSet.add(photo.photographerName);
                    }
                });
            }
            if (image.attribution?.length) {
                image.attribution.forEach(attr => {
                    if (attr.author) {
                        authorSet.add(attr.author);
                    }
                });
            }
        });

        const result = {
            totalImages: totalCount,
            typeCounts,
            uniquePhotographers: photographerSet.size,
            uniqueAuthors: authorSet.size
        };

        return successResponse('Data fetched successfully', result);
    } catch (error) {
        console.error('Error:', error);
        return serverErrorResponse('Internal Server Error. Please try again later.');
    }
}