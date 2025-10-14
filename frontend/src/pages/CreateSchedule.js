import React from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import ScheduleForm from "../components/ScheduleForm";
// import ScheduleForm from "./TestPage";

const CreateSchedule = () => {
  return (
    <AdminDashboardLayout>
      <ScheduleForm />
    </AdminDashboardLayout>
  );
};

export default CreateSchedule;
