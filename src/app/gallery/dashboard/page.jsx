"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import axios from "axios";

function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`../../api/dashboard`);
      console.log("records: ", response.data.data);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-4 lg:mt-28 xl:mt-28 sm:mt-12 md:mt-12 bg-gray-100">
          {dashboardData ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Total Images */}
                <div className="flex-1 p-4 bg-white shadow rounded">
                  <h2 className="font-semibold" style={{ fontSize: "16px" }} >Total Images</h2>
                  <p style={{ fontSize: "14px" }}>{dashboardData.totalImages}</p>
                </div>

                {/* Type Counts */}
                <div className="flex-1 p-4 bg-white shadow rounded">
                  <h2 className="font-semibold" style={{ fontSize: "16px" }}>Type Counts</h2>
                  <ul className="list-disc list-inside" style={{ fontSize: "14px" }}>
                    <li>Drawing: {dashboardData.typeCounts.Drawing}</li>
                    <li>Fresco: {dashboardData.typeCounts.Fresco}</li>
                    <li>Painting: {dashboardData.typeCounts.Painting}</li>
                    <li>Sculpture: {dashboardData.typeCounts.Sculpture}</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Unique Authors */}
                <div className="flex-1 p-4 bg-white shadow rounded">
                  <h2 className="font-semibold" style={{ fontSize: "14px" }}>Unique Authors</h2>
                  <p style={{ fontSize: "16px" }}>{dashboardData.uniqueAuthors}</p>
                </div>

                {/* Unique Photographers */}
                <div className="flex-1 p-4 bg-white shadow rounded">
                  <h2 className="font-semibold" style={{ fontSize: "16px" }}>Unique Photographers</h2>
                  <p style={{ fontSize: "16px" }}>{dashboardData.uniquePhotographers}</p>
                </div>
              </div>
            </div>
          ) : (
            <p style={{fontSize:"16px"}}>Loading dashboard data...</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
