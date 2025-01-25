"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Header from "../../../../components/header/Header";
import { validationSchemaForAttribution } from '@/app/helpers/clientSideValidations';
import Link from "next/link";
import Swal from 'sweetalert2';
import { Formik, FieldArray, Form, Field } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Page({ params }) {
    const router = useRouter();
    const id = params.id;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(false);

    const initialValues = {
        attribution: [
            {
                author: "",
                authorDates: {
                    birthYear: "",
                    deathYear: "",
                    birthCity: "",
                    deathCity: "",
                },
                school: "",
                centuryOfActivity: ""
            },
        ],
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`../../../../api/images/attribution/${id}`);
            const records = response.data.data.records;
            setTitle(records.object.subjectTitle);
        } catch (error) {
            console.error("Error fetching projects: ", error);
            setData([]);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            await validationSchemaForAttribution.validate(values, { abortEarly: false });

            const formData = new FormData();

            Object.keys(values).forEach(key => {
                if (Array.isArray(values[key])) {
                    values[key].forEach((item, index) => {
                        Object.keys(item).forEach(subKey => {
                            formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
                        });
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            // console.log("Form Values:", values);
            // console.log("FormData Entries:");
            // formData.forEach((value, key) => {
            //     console.log(`${key}:`, value);
            // });

            const jsonData = {
                attribution: Array.isArray(values.attribution) ? values.attribution : [],
            };

            const response = await axios.put(`../../../../../../api/images/attribution/${id}`, jsonData);

            if (response.data.status === 200) {
                toast.success(response.data.message);
                router.push(`../../../../gallery/image/attributions/${id}`);
            } else {
                toast.error(response.data.message || 'Something went wrong. Please try again!',);
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const firstError = error.inner[0];
                if (firstError) {
                    toast.error(firstError.message);
                }
            }
            else if (error.response) {
                toast.error(error.response.data.message || "An error occurred");
            }
            else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <ToastContainer />
            <Header toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 bg-white">
                <div className="fixed z-50">
                    <Sidebar isSidebarOpen={isSidebarOpen} />
                </div>

                <main className="flex-1 p-3 pt-4 h-screen bg-white overflow-y-auto z-1 lg:ml-64 lg:mt-20 " style={{ fontFamily: "calibri" }}>
                    <div className="mb-6 lg:ml-7 ml-7 mt-4">
                        <h1 className="text-gray-700 font-semibold" style={{ fontSize: "16px" }}>
                            Add Image Attribution{" "}
                        </h1>
                        <p className="" style={{ fontSize: "14px" }}>
                            <Link href={"../image/list"}>{title}</Link> / Add Attribution
                        </p>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ values, isSubmitting }) => (
                            <Form className="mx-7" method="post">

                                {/* Attributions */}

                                <div className="mb-4">
                                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('attribution')}>
                                        <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Current Attribution</h2>
                                    </div>
                                    <div className='mx-4'>
                                        <FieldArray name="attribution">
                                            {({ insert, remove, push }) => (
                                                <div>
                                                    {values.attribution.length > 0 && values.attribution.map((_, index) => (
                                                        <div key={index} className="mb-4">
                                                            <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Author</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].author`}
                                                                        placeholder="Enter Author"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>Birth Year</label>
                                                                    <Field
                                                                        type="number"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].authorDates.birthYear`}
                                                                        placeholder="Enter Birth Year"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>Death Year</label>
                                                                    <Field
                                                                        type="number"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].authorDates.deathYear`}
                                                                        placeholder="Enter Death Year"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>Birth City</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].authorDates.birthCity`}
                                                                        placeholder="Enter Birth City"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>Death City</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].authorDates.deathCity`}
                                                                        placeholder="Enter Death City"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>School/Associated City (optional)</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].school`}
                                                                        placeholder="Enter School/Associated City"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>Century of Activity</label>
                                                                    <Field
                                                                        type="text"
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        name={`attribution.[0].centuryOfActivity`}
                                                                        placeholder="Enter Century of Activity"
                                                                        style={{ fontSize: "14px" }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </main>

            </div>

        </div>
    );
}

export default Page;
