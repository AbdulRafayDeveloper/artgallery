"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/header/Header";
import { updationValidationSchema } from '@/app/helpers/clientSideValidations';
import { useRouter } from 'next/navigation';
import { Formik, FieldArray, Form, Field } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { FaPlus, FaMinus, FaDownload, FaTrash } from 'react-icons/fa';
import axios from "axios";
import Swal from 'sweetalert2';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function Page({ params }) {
  const router = useRouter();
  const id = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isObjectSectionOpen, setIsObjectSectionOpen] = useState(true);
  const [isLocationSectionOpen, setIsLocationSectionOpen] = useState(true);
  const [isProvenanceSectionOpen, setIsProvenanceSectionOpen] = useState(true);
  const [isBibliographySectionOpen, setIsBibliographySectionOpen] = useState(true);
  const [isExhibitionSectionOpen, setIsExhibitionSectionOpen] = useState(true);
  const [isPhotographsSectionOpen, setIsPhotographsSectionOpen] = useState(true);
  const [isAdditionalInformationSectionOpen, setIsAdditionalInformationSectionOpen] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [additionalInformation, setAdditionalInformation] = useState([]);

  const [initialValues, setInitialValues] = useState({
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
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`../../../../api/images/attribution/${id}`);
      const records = response.data.data.records;
      console.log("records: ", records.photographs);
      console.log("records 1: ", records.photographs[0].images);
      console.log("records 2: ", records.photographs[1].images);
      console.log("records 3: ", records.photographs[2].images);
      setThumbnail(records.thumbnail);
      setAdditionalInformation(records.additionalInformation);
      setInitialValues(prevValues => ({
        ...prevValues,
        object: records.object,
        location: records.location,
        provenance: records.provenance,
        bibliography: records.bibliography,
        exhibition: records.exhibition,
        photographs: records.photographs,
      }));
      console.log("records.object: ", records.object)
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  };

  const downloadImagesAsZip = async (photograph) => {
    const zip = new JSZip();
    const folder = zip.folder('photograph_images');

    await Promise.all(
      photograph.images.map(async (image) => {
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          const filename = image.split('/').pop();
          folder.file(filename, blob);
        } catch (error) {
          console.error(`Error fetching image ${image}:`, error);
        }
      })
    );

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${photograph.photographerName || 'photograph'}_images.zip`);
    });
  };

  const downloadThumbnail = () => {
    const link = document.createElement('a');
    link.href = thumbnail;
    link.download = thumbnail?.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFile = (filePath) => {
    const fileName = filePath.split('/').pop();
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFile = (filePath) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("Removing file:", filePath);
          const response = await axios.delete(`../../../../api/images/additionalInformation/${id}`, {
            data: { filePath }
          });

          if (response.data.status === 200) {
            setAdditionalInformation(prevInfo => prevInfo.filter(info => info !== filePath));
          } else {
            Swal.fire('Error!', response.data.message, 'error');
          }
        } catch (error) {
          console.error('Error deleting file:', error);
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (section) => {
    if (section === 'object') {
      setIsObjectSectionOpen(!isObjectSectionOpen);
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
    }
    else if (section === 'additonalInformation') {
      setIsAdditionalInformationSectionOpen(!isAdditionalInformationSectionOpen);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await updationValidationSchema.validate(values, { abortEarly: false });
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

      // console.log("Form Values:", values);
      // console.log("FormData Entries:");
      // formData.forEach((value, key) => {
      //   console.log(`${key}:`, value);
      // });

      const jsonData = {
        thumbnail: values.thumbnail,
        object: values.object,
        location: values.location,
        provenance: Array.isArray(values.provenance) ? values.provenance : [],
        bibliography: Array.isArray(values.bibliography) ? values.bibliography : [],
        exhibition: Array.isArray(values.exhibition) ? values.exhibition : [],
        photographs: Array.isArray(values.photographs) ? values.photographs : [],
        additionalInformation: Array.isArray(values.additionalInformation) ? values.additionalInformation : [],
      };

      const response = await axios.put(`/api/images/${id}`, jsonData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        toast.success(response.data.message);
        // router.push("../../../gallery/image/list");
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
              <h1 className="text-gray-700 font-medium text-2xl ">
                Image Art Work{" "}
              </h1>
              <p className="font-light text-sm">
                <Link href={"../image/list"}>Images</Link> / Update Image
              </p>
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form name="employeeForm" id="employeeForm" className="mx-7"
                  method="post" encType="multipart/form-data">

                  {/* Main Image */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4">
                      <h2 className="text-gray-700 font-semibold text-xl">
                        Main Image
                      </h2>
                      {thumbnail && (
                        <FaDownload
                          className="text-gray-700 cursor-pointer"
                          size={17}
                          onClick={downloadThumbnail}
                        />
                      )}
                    </div>
                    <div className='mx-4'>
                      <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                        <div className="flex-1">
                          <Field name="thumbnail">
                            {({ field, form }) => (
                              <input
                                type="file"
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
                      <h2 className="text-gray-700 font-semibold text-xl">Object</h2>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Subject/Title
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.subjectTitle"
                              placeholder="Enter Subject/Title" />
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Dating From (optional)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dating.from"
                              placeholder="Enter Dating From" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Dating to (optional)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dating.to"
                              placeholder="Enter Dating To" />
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Century (optional)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.century"
                              placeholder="Enter Century" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Medium
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.medium"
                              placeholder="Enter Medium" />
                          </div>
                        </div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Dimensions (optional)
                        </label>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 my-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Height (cm)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dimensions.height"
                              placeholder="Enter Dimension Height" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Width (cm)
                            </label>
                            <Field
                              type="number"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="object.dimensions.width"
                              placeholder="Enter Dimension Width" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location */}

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('location')}>
                      <h2 className="text-gray-700 font-semibold text-xl">Location</h2>
                      {isLocationSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                    </div>
                    {isLocationSectionOpen && (
                      <div className='mx-4'>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Last Know Location
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="location.lastKnow"
                              placeholder="Enter Last Know" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Type
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="location.type"
                              placeholder="Enter Type" />
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0 mb-4'>
                          <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Date In (optional)
                            </label>
                            <Field
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              name="location.dateIn"
                              placeholder="Enter Date In" />
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
                      <h2 className="text-gray-700 font-semibold text-xl">Provenance</h2>
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
                                        />
                                        <Field
                                          name={`provenance.${index}.city`}
                                          placeholder="City"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                        <Field
                                          type="number"
                                          name={`provenance.${index}.yearFrom`}
                                          placeholder="Year From"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                        <Field
                                          type="number"
                                          name={`provenance.${index}.yearTo`}
                                          placeholder="Year To"
                                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                      <h2 className="text-gray-700 font-semibold text-xl">Bibliography</h2>
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
                                      placeholder="Author Name" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].title`}
                                      placeholder="Title (optional)" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].publicationCity`}
                                      placeholder="Publication City (opt)" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].publicationName`}
                                      placeholder="Publication Name (opt)" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].publicationYear`}
                                      placeholder="Publication Year" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`bibliography[${index}].pageNumber`}
                                      placeholder="Page Number" />
                                    <div>
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        onClick={() => remove(index)}
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
                      <h2 className="text-gray-700 font-semibold text-xl">Exhibition</h2>
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
                                      placeholder="Institution/Gallery" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].title`}
                                      placeholder="Title (optional)" />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].exhibitionCity`}
                                      placeholder="Exhibition City (opt)" />
                                    <Field
                                      type="number"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`exhibition[${index}].exhibitionYear`}
                                      placeholder="Exhibition Year" />
                                    <div>
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        onClick={() => remove(index)}
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
                              >
                                Add Exhibition
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('photographs')}>
                      <h2 className="text-gray-700 font-semibold text-xl">Photographs</h2>
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
                                    />
                                    <Field
                                      type="date"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].date`}
                                      placeholder="Enter Date"
                                    />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].location`}
                                      placeholder="Enter Location"
                                    />
                                    <Field
                                      type="text"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      name={`photographs[${index}].photographerName`}
                                      placeholder="Enter Photographer Name"
                                    />
                                  </div>
                                  <div className='flex space-x-2'>
                                    <div className="">
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white p-2 rounded"
                                        onClick={() => downloadImagesAsZip(photograph)}
                                      >
                                        <FaDownload className="" />
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        type="button"
                                        className="bg-gray-700 text-white px-2 py-1 rounded"
                                        onClick={() => remove(index)}
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
                          <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => toggleSection('additionalInformation')}>
                            <h2 className="text-gray-700 font-semibold text-xl">Additional Information</h2>
                            {isAdditionalInformationSectionOpen ? <FaMinus className="text-gray-700" /> : <FaPlus className="text-gray-700" />}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-2">
                            {additionalInformation && additionalInformation.map((info, index) => (
                              <div key={index} className="flex flex-col items-start space-y-2 border p-4 rounded-md shadow-md">
                                <p className="whitespace-normal break-all">{info ? info.split('/').pop() : "No file available"}</p> {/* Show only the file name */}
                                <div className="flex space-x-2">
                                  <FaDownload
                                    className="text-gray-700 cursor-pointer"
                                    size={17}
                                    onClick={() => downloadFile(info)}
                                  />
                                  <FaTrash
                                    className="text-gray-700 cursor-pointer"
                                    size={17}
                                    onClick={() => removeFile(info, index)}
                                  />
                                </div>
                              </div>
                            ))}
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
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <button
                                      type="button"
                                      className="bg-gray-700 text-white px-2 py-1 rounded"
                                      onClick={() => arrayHelpers.remove(index)}
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