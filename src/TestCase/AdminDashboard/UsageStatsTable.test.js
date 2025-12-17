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

  test("renders correct table headers", () => {
    render(<UsageStatsTable users={adminKpiTableData} />);

    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("User Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
