import MainImage from "../../../../../models/MainImage";
import { connectDB } from "@/app/config/db";
import { notFoundResponse, serverErrorResponse } from "@/app/helpers/apiResponseHelpers";
import { Parser } from 'json2csv';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const id = params.id;

        if (!id) {
            return notFoundResponse('Image ID is required.', null);
        }

        const image = await MainImage.findById(id);

        if (!image) {
            return notFoundResponse('Image not found.', null);
        }

        const fields = ['author', 'school', 'centuryOfActivity', 'authorDates.birthYear', 'authorDates.deathYear', 'authorDates.birthCity', 'authorDates.deathCity'];
        const parser = new Parser({ fields });
        const csv = parser.parse(image.attribution);

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${image.object.subjectTitle}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return serverErrorResponse('Internal Server Error. Please try again later.');
    }
}