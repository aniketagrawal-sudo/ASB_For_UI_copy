import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UsageStatsTable from "../../components/AdminPersona/UsageStatsTable.jsx";
import { adminKpiTableData } from "../HomeDatasets/AdminKPIDatasets.js";

describe("UsageStatsTable", () => {
  test("renders all KPI rows", () => {
    render(<UsageStatsTable users={adminKpiTableData} />);

    expect(screen.getByText("KPI One")).toBeInTheDocument();
    expect(screen.getByText("KPI Two")).toBeInTheDocument();
  });

  test("filters rows based on search text", () => {
    render(<UsageStatsTable users={adminKpiTableData} search="one" />);

    // Only KPI One should appear
    expect(screen.getByText("KPI One")).toBeInTheDocument();
    expect(screen.queryByText("KPI Two")).not.toBeInTheDocument();
  });

  test("shows empty state when no KPI matches search", () => {
    render(<UsageStatsTable users={adminKpiTableData} search="zzz" />);

    expect(screen.getByText("No KPI found.")).toBeInTheDocument();
  });

  test("triggers onEdit callback when edit button is clicked", () => {
    const handleEdit = jest.fn();
    render(<UsageStatsTable users={adminKpiTableData} onEdit={handleEdit} />);

    const editButtons = screen.getAllByLabelText("edit user");

    fireEvent.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(adminKpiTableData[0]);
  });

  test("triggers onDelete callback when delete button is clicked", () => {
    const handleDelete = jest.fn();
    render(<UsageStatsTable users={adminKpiTableData} onDelete={handleDelete} />);

    const deleteButtons = screen.getAllByLabelText("delete user");

    fireEvent.click(deleteButtons[1]);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(adminKpiTableData[1]);
  });

  test("renders correct table headers", () => {
    render(<UsageStatsTable users={adminKpiTableData} />);

    expect(screen.getByText("KPI Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Allocated Persona")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
