import MainImage from "../../../models/MainImage";
import { connectDB } from "@/app/config/db";
import { successResponse, serverErrorResponse, notFoundResponse } from "@/app/helpers/apiResponseHelpers";

export async function GET(req) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page')) || 1;
        const pageSize = parseInt(url.searchParams.get('limit')) || 15;
        const searchQuery = url.searchParams.get('search') || '';
        const type = url.searchParams.get('type') || '';
        const datingFrom = parseInt(url.searchParams.get('datingFrom')) || null;
        const datingTo = parseInt(url.searchParams.get('datingTo')) || null;
        const location = url.searchParams.get('location') || '';
        const provenance = url.searchParams.get('provenance') || '';
        const sortBy = url.searchParams.get('sortBy') || 'createdAt';
        const sortOrder = url.searchParams.get('sortOrder') || 'desc';

        let query = {};

        // Search filter
        if (searchQuery) {
            query.$or = [
                { 'object.subjectTitle': { $regex: searchQuery, $options: 'i' } },
                { 'object.artist': { $regex: searchQuery, $options: 'i' } },
                { 'object.previousOwners': { $regex: searchQuery, $options: 'i' } }
            ];
        }

        if (type) {
            query['object.type'] = type;
        }

        if (datingFrom && datingTo) {
            query['object.dating'] = { $gte: datingFrom, $lte: datingTo };
        } else if (datingFrom) {
            query['object.dating'] = { $gte: datingFrom };
        } else if (datingTo) {
            query['object.dating'] = { $lte: datingTo };
        }

        if (location) {
            query['object.location'] = { $regex: location, $options: 'i' };
        }

        if (provenance) {
            query['object.provenance'] = { $regex: provenance, $options: 'i' };
        }

        // Sorting
        const sortOptions = {};
        switch (sortBy) {
            case 'author':
                sortOptions['object.attribution.author'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'subjectTitle':
                sortOptions['object.subjectTitle'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'type':
                sortOptions['object.type'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'medium':
                sortOptions['object.medium'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'datingFrom':
                sortOptions['object.datingFrom'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'datingTo':
                sortOptions['object.datingTo'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'century':
                sortOptions['object.century'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'width':
                sortOptions['object.dimensions.width'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'height':
                sortOptions['object.dimensions.height'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'attributionAuthorDate':
                sortOptions['object.attribution.authorDate'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'locationLastKnown':
                sortOptions['object.locationLastKnown'] = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'bibliographyArtist':
                sortOptions['object.bibliography.artist'] = sortOrder === 'asc' ? 1 : -1;
                break;
            default:
                sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const totalRecords = await MainImage.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / pageSize);
        const skip = (page - 1) * pageSize;
        const projects = await MainImage.find(query).sort(sortOptions).skip(skip).limit(pageSize);

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
