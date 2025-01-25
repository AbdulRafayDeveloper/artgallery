import * as Yup from 'yup';

export const validationSchema = Yup.object({
    thumbnail: Yup.string().required('Main Image: Required'),
    object: Yup.object({
        type: Yup.string().oneOf(['Painting', 'Fresco', 'Sculpture', 'Drawing'], 'Object: Type is invalid it must be selected').required('Object: Type is required'),
        subjectTitle: Yup.string().required('Object: Subject Title is required'),
        dating: Yup.object({
            from: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Dating from must be a number'),
            to: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Dating to must be a number'),
        }),
        century: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Century must be a number'),
        medium: Yup.string().required('Object: Medium is required'),
        dimensions: Yup.object({
            width: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Width must be a number'),
            height: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Height must be a number'),
        })
    }),
    attribution: Yup.array().of(Yup.object({
        author: Yup.string().required('Attribution: Author is required'),
        authorDates: Yup.object({
            birthYear: Yup.number().required('Attribution: Birth Year is required').typeError('Attribution: Birth Year must be a number'),
            deathYear: Yup.number().required('Attribution: Death Year is required').typeError('Attribution: Death Year must be a number'),
            birthCity: Yup.string().required('Attribution: Birth Year is required').typeError('Attribution: Birth Year must be a number'),
            deathCity: Yup.string().required('Attribution: Death Year is required').typeError('Attribution: Death Year must be a number'),
        }).required('Attribution: Author Dates are required'),
        school: Yup.string().nullable(),
        centuryOfActivity: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Attribution: Activity of Century must be a number'),
    })),
    location: Yup.object({
        lastKnow: Yup.string().required('Location: Last known is required'),
        type: Yup.string().required('Location: Type is required'),
        dateIn: Yup.number().required('Location: Date in is required').typeError('Location: Date in must be a number'),
    }).required('Location information is required'),
    provenance: Yup.array().of(Yup.object({
        collectionName: Yup.string().required('Provenance: Collection is required'),
        city: Yup.string().required('Provenance: City is required'),
        yearFrom: Yup.number().required('Provenance: Year From date is required').typeError('Provenance: Year From date must be a number'),
        yearTo: Yup.number().required('Provenance: Year To date is required').typeError('Provenance: Year To date must be a number'),
    })).min(1, 'Provenance: At least one provenance item is required'),
    bibliography: Yup.array().of(Yup.object({
        authorName: Yup.string().required('Bibliography: Author Name is required'),
        title: Yup.string(),
        publicationCity: Yup.string(),
        publicationName: Yup.string(),
        publicationYear: Yup.number().required('Bibliography: Publication Year is required').typeError('Bibliography: Publication Year must be a number'),
        pageNumber: Yup.number().required('Bibliography: Page Number is required').typeError('Bibliography: Page Number must be a number'),
    })),
    exhibition: Yup.array().of(Yup.object({
        institution: Yup.string().required('Exhibition: Institution/Gallery is required'),
        title: Yup.string(),
        exhibitionCity: Yup.string(),
        exhibitionYear: Yup.number().required('Exhibition: Exhibition Year is required').typeError('Exhibition: Exhibition Year must be a number'),
    })),
    photographs: Yup.array().of(Yup.object({
        date: Yup.string().required('Photographs: Date is required'),
        location: Yup.string().required('Photographs: Location is required').typeError('Photographs: Location must be a string'),
        photographerName: Yup.string().required('Photographs: Photographer Name is required').typeError('Photographs: Photographer Name must be a string'),
    }))
});

export const updationValidationSchema = Yup.object({
    object: Yup.object({
        type: Yup.string().oneOf(['Painting', 'Fresco', 'Sculpture', 'Drawing'], 'Object: Type is invalid it must be selected').required('Object: Type is required'),
        subjectTitle: Yup.string().required('Object: Subject Title is required'),
        dating: Yup.object({
            from: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Dating from must be a number'),
            to: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Dating to must be a number'),
        }),
        century: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Century must be a number'),
        medium: Yup.string().required('Object: Medium is required'),
        dimensions: Yup.object({
            width: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Width must be a number'),
            height: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Object: Height must be a number'),
        })
    }),
    attribution: Yup.array().of(Yup.object({
        author: Yup.string().required('Attribution: Author is required'),
        authorDates: Yup.object({
            birthYear: Yup.number().required('Attribution: Birth Year is required').typeError('Attribution: Birth Year must be a number'),
            deathYear: Yup.number().required('Attribution: Death Year is required').typeError('Attribution: Death Year must be a number'),
            birthCity: Yup.string().required('Attribution: Birth Year is required').typeError('Attribution: Birth Year must be a number'),
            deathCity: Yup.string().required('Attribution: Death Year is required').typeError('Attribution: Death Year must be a number'),
        }).required('Attribution: Author Dates are required'),
        school: Yup.string().nullable(),
        centuryOfActivity: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Attribution: Activity of Century must be a number'),
    })),
    location: Yup.object({
        lastKnow: Yup.string().required('Location: Last known is required'),
        type: Yup.string().required('Location: Type is required'),
        dateIn: Yup.number().required('Location: Date in is required').typeError('Location: Date in must be a number'),
    }).required('Location information is required'),
    provenance: Yup.array().of(Yup.object({
        collectionName: Yup.string().required('Provenance: Collection is required'),
        city: Yup.string().required('Provenance: City is required'),
        yearFrom: Yup.number().required('Provenance: Year From date is required').typeError('Provenance: Year From date must be a number'),
        yearTo: Yup.number().required('Provenance: Year To date is required').typeError('Provenance: Year To date must be a number'),
    })).min(1, 'Provenance: At least one provenance item is required'),
    bibliography: Yup.array().of(Yup.object({
        authorName: Yup.string().required('Bibliography: Author Name is required'),
        title: Yup.string(),
        publicationCity: Yup.string(),
        publicationName: Yup.string(),
        publicationYear: Yup.number().required('Bibliography: Publication Year is required').typeError('Bibliography: Publication Year must be a number'),
        pageNumber: Yup.number().required('Bibliography: Page Number is required').typeError('Bibliography: Page Number must be a number'),
    })),
    exhibition: Yup.array().of(Yup.object({
        institution: Yup.string().required('Exhibition: Institution/Gallery is required'),
        title: Yup.string(),
        exhibitionCity: Yup.string(),
        exhibitionYear: Yup.number().required('Exhibition: Exhibition Year is required').typeError('Exhibition: Exhibition Year must be a number'),
    })),
    photographs: Yup.array().of(Yup.object({
        date: Yup.string().required('Photographs: Date is required'),
        location: Yup.string().required('Photographs: Location is required').typeError('Photographs: Location must be a string'),
        photographerName: Yup.string().required('Photographs: Photographer Name is required').typeError('Photographs: Photographer Name must be a string'),
    }))
});

export const validationSchemaForAttribution = Yup.object({
    attribution: Yup.array().of(Yup.object({
        author: Yup.string().required('Attribution: Author is required'),
        authorDates: Yup.object({
            birthYear: Yup.number().required('Attribution: Birth Year is required').typeError('Attribution: Birth Year must be a number'),
            deathYear: Yup.number().required('Attribution: Death Year is required').typeError('Attribution: Death Year must be a number'),
            birthCity: Yup.string().required('Attribution: Birth Year is required').typeError('Attribution: Birth Year must be a number'),
            deathCity: Yup.string().required('Attribution: Death Year is required').typeError('Attribution: Death Year must be a number'),
        }).required('Attribution: Author Dates are required'),
        school: Yup.string().nullable(),
        centuryOfActivity: Yup.number().nullable().transform((value, originalValue) => (originalValue === '' ? null : value)).typeError('Attribution: Activity of Century must be a number'),
    })),
});