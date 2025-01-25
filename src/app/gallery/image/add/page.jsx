"use client";
import React, { useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import { validationSchema } from '@/app/helpers/clientSideValidations';
import { useRouter } from 'next/navigation';
import { Formik, FieldArray, Form, Field } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from "axios";
import Swal from 'sweetalert2';

function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isObjectSectionOpen, setIsObjectSectionOpen] = useState(true);
  const [isAttributionSectionOpen, setIsAttributionSectionOpen] = useState(true);
  const [isLocationSectionOpen, setIsLocationSectionOpen] = useState(true);
  const [isProvenanceSectionOpen, setIsProvenanceSectionOpen] = useState(true);
  const [isBibliographySectionOpen, setIsBibliographySectionOpen] = useState(true);
  const [isExhibitionSectionOpen, setIsExhibitionSectionOpen] = useState(true);
  const [isPhotographsSectionOpen, setIsPhotographsSectionOpen] = useState(true);
  const [isAdditionalInformationSectionOpen, setIsAdditionalInformationSectionOpen] = useState(true);

  const initialValues = {
    thumbnail: null,
    object: {
      type: "",
      subjectTitle: "",
      dating: {
        from: "",
        to: "",
      },
      century: "",
      medium: "",
      dimensions: {
        width: "",
        height: "",
      },
    },
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
    location: {
      lastKnow: "",
      type: "",
      dateIn: "",
    },
    provenance: [
      {
        collectionName: "",
        city: "",
        yearFrom: "",
        yearTo: "",
      },
    ],
    bibliography: [
      {
        authorName: "",
        title: "",
        publicationCity: "",
        publicationName: "",
        publicationYear: "",
        pageNumber: "",
      },
    ],
    exhibition: [
      {
        institution: "",
        title: "",
        exhibitionCity: "",
        exhibitionYear: ""
      },
    ],
    photographs: [
      {
        images: [],
        date: "",
        location: "",
        photographerName: "",
      },
    ],
    additionalInformation: []
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (section) => {
    if (section === 'object') {
      setIsObjectSectionOpen(!isObjectSectionOpen);
    } else if (section === 'attribution') {
      setIsAttributionSectionOpen(!isAttributionSectionOpen);
    } else if (section === 'location') {
      setIsLocationSectionOpen(!isLocationSectionOpen);
    } else if (section === 'provenance') {
      setIsProvenanceSectionOpen(!isProvenanceSectionOpen);
    } else if (section === 'bibliography') {
      setIsBibliographySectionOpen(!isBibliographySectionOpen);
    } else if (section === 'exhibition') {
      setIsExhibitionSectionOpen(!isExhibitionSectionOpen);
    } else if (section === 'photographs') {
      setIsPhotographsSectionOpen(!isPhotographsSectionOpen);
    } else if (section === 'additonalInformation') {
      setIsAdditionalInformationSectionOpen(!isAdditionalInformationSectionOpen);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      // Log file information
      console.log("Photographs:", values.photographs[0]);
      await validationSchema.validate(values, { abortEarly: false });
      const formData = new FormData();

      if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
      }

      Object.keys(values).forEach(key => {
        if (Array.isArray(values[key])) {
          values[key].forEach((item, index) => {
            if (key === 'additionalInformation') {
              formData.append(`[${key}${index}]`, item.file);
            } else {
              Object.keys(item).forEach(subKey => {
                formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
              });
            }
          });
        } else {
          if (typeof values[key] === 'object' && values[key] !== null) {
            Object.keys(values[key]).forEach(subKey => {
              formData.append(`${key}[${subKey}]`, values[key][subKey]);
            });
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      console.log("Form Values:", values);
      console.log("FormData Entries:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const jsonData = {
        thumbnail: values.thumbnail,
        object: values.object,
        attribution: Array.isArray(values.attribution) ? values.attribution : [],
        location: values.location,
        provenance: Array.isArray(values.provenance) ? values.provenance : [],
        bibliography: Array.isArray(values.bibliography) ? values.bibliography : [],
        exhibition: Array.isArray(values.exhibition) ? values.exhibition : [],
        photographs: Array.isArray(values.photographs) ? values.photographs : [],
        additionalInformation: Array.isArray(values.additionalInformation) ? values.additionalInformation : [],
      };

      const response = await axios.post("/api/images", jsonData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        toast.success(response.data.message);
        // router.push("../../gallery/image/list");
      } else {
        toast.error(response.data.message || 'Something went wrong. Please try again!',);
      }
    } catch (error) {
      console.log(error);
      if (error.name === 'ValidationError') {
        toast.error(error.errors[0]);
      } else if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(true);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-white">
        <ToastContainer />
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 w-full bg-white">
          <div className="fixed">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>
          <main className="flex-1 p-3 pt-4 h-screen bg-white overflow-y-auto z-1 lg:ml-64 lg:mt-20 " style={{ fontFamily: "calibri" }}>
            <div className="mb-6 lg:ml-7 ml-7 mt-4">
              <p className="text-gray-700 font-semibold" style={{ fontSize: "16px" }}>
                Add Art Work{" "}
              </p>
              <p className="font-semibold" style={{ fontSize: "14px" }}>
                <Link href={"../image/list"}>Images</Link> / Add Image
              </p>
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form name="employeeForm" id="employeeForm" className="mx-7"
                  method="post" encType="multipart/form-data">

                  {/* Main Image */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('object')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Main Image</h2>
                    </div>
                    <div className='mx-4' >
                      <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                        <div className="flex-1">
                          <Field name="thumbnail">
                            {({ field, form }) => (
                              <input
                                type="file"
                                style={{ fontSize: "14px" }}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(event) => {
                                  const file = event.target.files[0];
                                  form.setFieldValue("thumbnail", file);
                                }}
                              />
                            )}
                          </Field>
                        </div>
                        <div className="flex-1">
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Object */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('object')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Object</h2>
                      {isObjectSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isObjectSectionOpen && (
                      <div className='mx-4'>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Type
                            </label>
                            <Field
                              as="select"
                              style={{ fontSize: "14px" }}
                              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.type"
                            >
                              <option value="" disabled selected>Select Type</option>
                              <option value="Painting">Painting</option>
                              <option value="Fresco">Fresco</option>
                              <option value="Sculpture">Sculpture</option>
                              <option value="Drawing">Drawing</option>
                            </Field>
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Subject/Title
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.subjectTitle"
                              style={{ fontSize: "14px" }}
                              placeholder="Enter Subject/Title" />
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Dating From (optional)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dating.from"
                              style={{ fontSize: "14px" }}
                              placeholder="Enter Dating From" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Dating to (optional)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dating.to"
                              placeholder="Enter Dating To"
                              style={{ fontSize: "14px" }} />
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Century (optional)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.century"
                              placeholder="Enter Century"
                              style={{ fontSize: "14px" }} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Medium
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.medium"
                              placeholder="Enter Medium"
                              style={{ fontSize: "14px" }} />
                          </div>
                        </div>
                        <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                          Dimensions (optional)
                        </label>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 my-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Height (cm)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dimensions.height"
                              placeholder="Enter Dimension Height"
                              style={{ fontSize: "14px" }} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Width (cm)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dimensions.width"
                              placeholder="Enter Dimension Width"
                              style={{ fontSize: "14px" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attributions */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('attribution')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Current Attribution</h2>
                      {isAttributionSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isAttributionSectionOpen && (
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
                    )}
                  </div>

                  {/* Location */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('location')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Location</h2>
                      {isLocationSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isLocationSectionOpen && (
                      <div className='mx-4'>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Last Know Location
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="location.lastKnow"
                              placeholder="Enter Last Know"
                              style={{ fontSize: "14px" }} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Type
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="location.type"
                              placeholder="Enter Type"
                              style={{ fontSize: "14px" }} />
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 font-semibold mb-2" style={{ fontSize: "14px" }}>
                              Date In (optional)
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="location.dateIn"
                              placeholder="Enter Date In"
                              style={{ fontSize: "14px" }} />
                          </div>
                          <div className="flex-1">
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* provenance  */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('provenance')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Provenance</h2>
                      {isProvenanceSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isProvenanceSectionOpen && (
                      <div className='mx-4'>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <FieldArray name="provenance">
                              {({ remove, push }) => (
                                <>
                                  {values.provenance.length > 0 &&
                                    values.provenance.map((provenance, index) => (
                                      <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4">
                                        <Field
                                          name={`provenance.${index}.collectionName`}
                                          placeholder="Collection"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                          style={{ fontSize: "14px" }}
                                        />
                                        <Field
                                          name={`provenance.${index}.city`}
                                          placeholder="City"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                          style={{ fontSize: "14px" }}
                                        />
                                        <Field
                                          type="number"
                                          name={`provenance.${index}.yearFrom`}
                                          placeholder="Year From"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                          style={{ fontSize: "14px" }}
                                        />
                                        <Field
                                          type="number"
                                          name={`provenance.${index}.yearTo`}
                                          placeholder="Year To"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                          style={{ fontSize: "14px" }}
                                        />
                                        <button
                                          type="button"
                                          className="bg-gray-700 text-white px-2 py-1 rounded sm:ml-2"
                                          onClick={() => remove(index)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  <button
                                    type="button"
                                    className="bg-gray-700 text-white px-2 py-1 rounded"
                                    onClick={() => push({ name: "", from: 0, to: 0 })}
                                    style={{ fontSize: "14px" }}
                                  >
                                    Add Provenance
                                  </button>
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bibliography Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('bibliography')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Bibliography</h2>
                      {isBibliographySectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isBibliographySectionOpen && (
                      <div className='mx-4'>
                        <FieldArray name="bibliography">
                          {({ insert, remove, push }) => (
                            <div>
                              {values.bibliography.map((_, index) => (
                                <div key={index} className="mb-4">
                                  <div className='grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-4 mb-4'>
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].authorName`}
                                      placeholder="Author Name"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].title`}
                                      placeholder="Title (optional)"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].publicationCity`}
                                      placeholder="Publication City (opt)"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].publicationName`}
                                      placeholder="Publication Name (opt)"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].publicationYear`}
                                      placeholder="Publication Year"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].pageNumber`}
                                      placeholder="Page Number"
                                      style={{ fontSize: "14px" }} />
                                    <div>
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        onClick={() => remove(index)}
                                        style={{ fontSize: "14px" }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="bg-gray-700 text-white px-2 py-1 rounded"
                                onClick={() => push({ artist: '', yearFrom: '', yearTo: '' })}
                                style={{ fontSize: "14px" }}
                              >
                                Add Bibliography
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    )}
                  </div>

                  {/* exhibition */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('exhibition')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Exhibition</h2>
                      {isExhibitionSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isExhibitionSectionOpen && (
                      <div className='mx-4'>
                        <FieldArray name="exhibition">
                          {({ insert, remove, push }) => (
                            <div>
                              {values.exhibition.map((_, index) => (
                                <div key={index} className="mb-4">
                                  <div className='flex flex-col sm:flex-row gap-4 mb-4'>
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].institution`}
                                      placeholder="Institution/Gallery"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].title`}
                                      placeholder="Title (optional)"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].exhibitionCity`}
                                      placeholder="Exhibition City (opt)"
                                      style={{ fontSize: "14px" }} />
                                    <Field
                                      type="number"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].exhibitionYear`}
                                      placeholder="Exhibition Year"
                                      style={{ fontSize: "14px" }} />
                                    <div>
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        onClick={() => remove(index)}
                                        style={{ fontSize: "14px" }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="bg-gray-700 text-white px-2 py-1 rounded"
                                onClick={() => push({ museumName: '', year: '' })}
                                style={{ fontSize: "14px" }}
                              >
                                Add Exhibition
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    )}
                  </div>

                  {/* photograph */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('photographs')}>
                      <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Photographs</h2>
                      {isPhotographsSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isPhotographsSectionOpen && (
                      <div className='mx-4'>
                        <FieldArray name="photographs">
                          {({ remove, push }) => (
                            <div>
                              {values.photographs.map((photograph, index) => (
                                <div key={index} className="mb-4">
                                  <div className='grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 mb-4'>
                                    <input
                                      type="file"
                                      multiple
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].images`}
                                      onChange={(event) => {
                                        const files = event.target.files;
                                        const updatedFilesArray = Array.from(files); // Convert FileList to Array
                                        const updatedPhotographs = [...values.photographs];
                                        updatedPhotographs[index].images = updatedFilesArray; // Update the existing entry
                                        setFieldValue("photographs", updatedPhotographs); // Update the state without adding new photograph
                                      }}
                                      style={{ fontSize: "14px" }}
                                    />
                                    <Field
                                      type="date"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].date`}
                                      placeholder="Enter Date"
                                      style={{ fontSize: "14px" }}
                                    />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].location`}
                                      placeholder="Enter Location"
                                      style={{ fontSize: "14px" }}
                                    />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].photographerName`}
                                      placeholder="Enter Photographer Name"
                                      style={{ fontSize: "14px" }}
                                    />
                                    <div>
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        onClick={() => remove(index)}
                                        style={{ fontSize: "14px" }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="bg-gray-700 text-white px-2 py-1 rounded"
                                onClick={() => push({ images: [], date: '', location: '', photographerName: '' })}
                                style={{ fontSize: "14px" }}
                              >
                                Add Photograph
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <FieldArray
                    name="additionalInformation"
                    render={arrayHelpers => (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('additonalInformation')}>
                            <h2 className="text-gray-700 font-semibold" style={{ fontSize: "14px" }}>Additional Information</h2>
                            {isAdditionalInformationSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                          </div>
                          {isAdditionalInformationSectionOpen && (
                            <div className='mx-4'>
                              {values.additionalInformation.map((info, index) => (
                                <div key={index} className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                                  <div className="flex-1">
                                    <input
                                      type="file"
                                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      onChange={event => {
                                        const file = event.target.files[0];
                                        arrayHelpers.replace(index, { file });
                                      }}
                                      style={{ fontSize: "14px" }}
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <button
                                      type="button"
                                      className="bg-gray-700 text-white px-2 py-1 rounded"
                                      onClick={() => arrayHelpers.remove(index)}
                                      style={{ fontSize: "14px" }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="bg-gray-700 text-white px-2 py-1 rounded mt-4"
                                onClick={() => arrayHelpers.push({ file: null })}
                                style={{ fontSize: "14px" }}
                              >
                                Add More File
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                      disabled={isSubmitting}
                      style={{ fontSize: "14px" }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </main>
        </div >
      </div >
    </>
  );
}

export default Page;