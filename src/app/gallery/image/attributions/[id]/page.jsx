"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowDown, faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';

function Page({ params }) {
    const router = useRouter();
    const id = params.id;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [data, setData] = useState([]);
    const [title, setTitle] = useState();
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [statusChange, setStatusChange] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const perPage = 10;

    useEffect(() => {
        fetchProjects(currentPage);
    }, [statusChange, currentPage]);

    const fetchProjects = async (page = 1) => {
        try {
            const response = await axios.get(`../../../api/images/attribution/${id}?page=${page}&limit=${perPage}&search=${searchQuery}`);
            const records = response.data.data.records;
            if (records.length === 0) {
                setData([]);
            } else {
                setData(records.attributions);
                setTitle(records.object.subjectTitle);
            }

            setTotalPages(response.data.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching projects: ", error);
            setData([]);
        }
    };

    const handleFilter = () => {
        setCurrentPage(1);
        fetchProjects(1);
    };

    const handleClear = (event) => {
        event.preventDefault();
        setSearchQuery('');
        setStatusChange(prevStatusChange => !prevStatusChange);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        fetchProjects(value);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Delete Api
    const handleDelete = async (attributionId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this record permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/images/attribution/${id}?attributionId=${attributionId}`);

                    if (response.data.status === 200) {
                        setStatusChange(prev => !prev);
                    } else {
                        Swal.fire('Error!', response.data.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error!', 'Deletion failed. Please try again!', 'error');
                }
            }
        });
    };

    const handleCSVDownload = async () => {
        try {
            const response = await axios.get(`../../../api/images/attribution/allAttribution/${id}`, {
                responseType: 'blob',
            });

            const fileName = `${title}.csv`;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading CSV:', error);
            Swal.fire('Error!', 'CSV download failed. Please try again!', 'error');
        }
    };


    return (
        <div className="flex flex-col h-screen bg-white">
            <Header toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 bg-white">
                <div className="fixed z-50">
                    <Sidebar isSidebarOpen={isSidebarOpen} />
                </div>

                <main className="flex-1 p-3 pt-4 h-screen bg-white overflow-y-auto z-1 lg:ml-64 lg:mt-20" style={{fontFamily:"calibri"}}>
                    <header>
                        <nav className="bg-white border-gray-200 py-2.5 mt-4">
                            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                                <h1 className="text-gray-700 font-semibold" style={{ fontSize: "16px" }}>
                                    Image Attributions
                                </h1>
                                <div className="flex flex-wrap items-center lg:order-2 md:order-2 lg:mt-0 mt-6 w-full lg:w-auto justify-start z-1">
                                    <div className="px-1 py-1 rounded-lg ml-0">
                                        <Link className="" href={`../attributions/add/${id}`} style={{ fontSize: "14px" }}>
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="mr-2 text-gray-700"
                                            />
                                            Attribution
                                        </Link>
                                    </div>

                                    <div className="px-1 py-1 rounded-lg" style={{ fontSize: "14px" }}>
                                        <button className="text-md" onClick={handleCSVDownload}>
                                            <FontAwesomeIcon icon={faArrowDown} className="mr-2 text-gray-700" />
                                            CSV
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            className="mx-3 block w-full pl-2 text-gray-700 rounded-lg bg-gray-50 focus:ring-blue-500 border-[0.5px] border-gray-200 placeholder-gray-400 focus:border-blue-500 py-1"
                                            placeholder="Attribution By Author"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            style={{ fontSize: "14px" }}
                                        />
                                        <button className="bg-gray-700 text-white px-4 rounded py-1" onClick={handleFilter} style={{ fontSize: "14px" }}>
                                            Search
                                        </button>
                                        <button className="bg-gray-700 text-white px-4 rounded py-1" onClick={handleClear} style={{ fontSize: "14px" }}>
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="my-4" style={{ fontSize: "14px" }}>
                                <p><b>Title:</b> {title}</p>
                            </div>
                        </nav>
                    </header>

                    <div className="relative overflow-x-auto ">
                        <div className="min-w-full max-w-screen-lg overflow-x-auto">
                            <table className="min-w-full text-sm text-left rtl:text-right text-gray-500 bg-white rounded-lg shadow-lg ">
                                <thead className="text-gray-700 uppercase bg-gray-50 overflow-x-auto">
                                    <tr style={{ fontSize: "14px" }}>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Author
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            School
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Century
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Birth Year
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Death Year
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Birth City
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Death City
                                        </th>
                                        <th scope="col" className="px-6 py-3 md:px-6 md:py-3 text-center" style={{ fontSize: "14px" }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 border-2 border-gray-200">
                                    {data && data.length > 0 ? (
                                        data.map((item) => {
                                            return (
                                                <tr key={item._id} className="bg-white border-2 border-gray-200">
                                                    <td className="px-6 py-2 text-gray-900 whitespace-nowrap text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>
                                                        {item.author}
                                                    </td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>{item.school}</td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>{item.centuryOfActivity}</td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>{item.authorDates.birthYear}</td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>{item.authorDates.deathYear}</td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>{item.authorDates.birthCity}</td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>{item.authorDates.deathCity}</td>
                                                    <td className="px-6 text-center border-2 border-gray-200" style={{ fontSize: "14px" }}>
                                                        <div className="flex justify-center space-x-2">
                                                            <Link
                                                                href={`../../../../gallery/image/attributions/update/${id}/${item._id}`}
                                                                className="text-gray-500 hover:text-gray-900"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                className="text-gray-700 hover:text-gray-900"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4" style={{ fontSize: "14px" }}>
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Stack spacing={2}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    shape="rounded"
                                    sx={{
                                        "& .Mui-selected": {
                                            backgroundColor: "#111827 !important",
                                            color: "white",
                                        },
                                        "& .MuiPaginationItem-root": {
                                            "&:hover": {
                                                backgroundColor: "#111827 !important",
                                                color: "white",
                                            },
                                        },
                                    }}
                                />
                            </Stack>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Page;
