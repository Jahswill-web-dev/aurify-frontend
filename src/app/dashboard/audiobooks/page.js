"use client";
import React from "react";
import DashboardNav from "../_components/dashboardNav";
import { Sidebar } from "../_components/sideNav";
import Audios from "./_components/audios";

function AudioBooks() {
  return (
    <div>
      <DashboardNav />
      <div className="flex w-full py-3">
        <Sidebar />
        <div className="min-[200px]:w-full sm:w-[70%] lg:w-[80%] flex justify-end">
          <Audios />
        </div>
      </div>
    </div>
  );
}

export default AudioBooks;
