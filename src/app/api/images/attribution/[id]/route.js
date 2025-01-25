import MainImage from "@/app/Models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, notFoundResponse, serverErrorResponse } from "@/app/helpers/apiResponseHelpers";
import * as helper from "@/app/helpers/apiHelpers";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('limit')) || 15;
        const searchQuery = url.searchParams.get('search') || '';
        const { id } = params;

        if (!id) {
            return notFoundResponse('Image ID is required.', null);
        }

        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found.', null);
        }

        let filteredAttributions = image.attribution || [];

        filteredAttributions.sort((a, b) => {
            return b._id.getTimestamp() - a._id.getTimestamp();
        });

        if (searchQuery) {
            filteredAttributions = filteredAttributions.filter(attribution =>
                attribution.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const totalAttributions = filteredAttributions.length;
        const totalPages = Math.ceil(totalAttributions / pageSize);
        const skip = (page - 1) * pageSize;
        const paginatedAttributions = filteredAttributions.slice(skip, skip + pageSize);

        return successResponse('Records fetched successfully.', {
            records: {
                ...image.toObject(), // Include all image details
                attributions: paginatedAttributions, // Include paginated attributions
            },
            pagination: {
                totalAttributions,
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

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const formData = await req.json();
        const values = await helper.handleNestedObjects(helper.parseFormDataWihoutEntries(formData));

        if (!id) {
            return notFoundResponse('Image ID is required.', null);
        }

        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found.', null);
        }

        if (!Array.isArray(image.attribution)) {
            image.attribution = [];
        }

        if (values.attribution && Array.isArray(values.attribution)) {
            values.attribution.forEach(attr => {
                image.attribution.push(attr);
            });
        }

        const updatedImage = await image.save();

        if (!updatedImage) {
            return notFoundResponse('Failed to update image.', null);
        }

        return successResponse('Attribution Added Successfully.', updatedImage);
    } catch (error) {
        console.log("Error: ", error);
        return serverErrorResponse('Internal Server Error. Please try again later!');
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const url = new URL(req.url);
        const attributionId = url.searchParams.get('attributionId');

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

        image.attribution = image.attribution.filter(
            (attr) => attr._id.toString() !== attributionId
        );

        const updatedImage = await image.save();

        if (!updatedImage) {
            return notFoundResponse('Failed to update image after deletion.', null);
        }

        return successResponse('Attribution removed successfully.', updatedImage);
    } catch (error) {
        console.log("Error: ", error);
        return serverErrorResponse('Internal Server Error. Please try again later!');
    }
}
