import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TotalProfitAndLossRelation from "../../components/Dashboards/Trends/TotalProfitAndLossRelation";
import mockTotalProfitAndLossRelationData from '../HomeDatasets/HomeDatasets';

// Mock RTK Query hook
jest.mock("../../services/dashboardApi", () => ({
  useGetTotalProfitAndLossRelationshipDetailsQuery: jest.fn(() => ({
    isLoading: false,
  })),
}));

// Mock recharts to avoid createElement / layout errors in JSDOM
jest.mock("recharts", () => {
  const Mock = ({ children }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Mock,
    BarChart: Mock,
    Bar: () => <div>Bar</div>,
    CartesianGrid: () => <div>Grid</div>,
    XAxis: () => <div>X Axis</div>,
    YAxis: () => <div>Y Axis</div>,
    Tooltip: () => <div>Tooltip</div>,
    Legend: () => <div>Legend</div>,
  };
});

// Mock SCSS modules
jest.mock("../../components/Dashboards/Trends/TotalProfitAndLossRelation.module.scss", () => ({
  revenueChartContainer: "revenueChartContainer",
  chartHeader: "chartHeader",
  chartTitle: "chartTitle",
  chartControls: "chartControls",
  filterButtons: "filterButtons",
  filterBtn: "filterBtn",
  active: "active",
  accountDropdown: "accountDropdown",
  dropdownSelect: "dropdownSelect",
  dropdownIcon: "dropdownIcon",
  dividerWrapper: "dividerWrapper",
  divider: "divider",
  chartWrapper: "chartWrapper",
}));

describe("TotalProfitAndLossRelation Component", () => {
  test("renders title correctly", () => {
    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);
    expect(screen.getByText(/Total P&L of Relationship/i)).toBeInTheDocument();
  });

  test("renders empty state when data = []", () => {
    render(
      <TotalProfitAndLossRelation
        filterdtTotalProfiandLossRelationship={{
          Top1: { YoY: { Profit: [] } },
        }}
      />
    );
    expect(screen.getByText("No data available for this selection")).toBeInTheDocument();
  });

  test("renders chart when data exists", () => {
    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);
    expect(screen.getByText("Bar")).toBeInTheDocument(); // rendered from mock
    expect(screen.getByText("Grid")).toBeInTheDocument();
  });

  test("switches time filter from YoY → MoM", () => {
    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);

    const momButton = screen.getByText("MoM");
    fireEvent.click(momButton);

    // Data for MoM Profit exists → chart should render
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });

  test("switches profit/loss filter", () => {
    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);

    const lossButton = screen.getByText("Loss");
    fireEvent.click(lossButton);

    // Loss YoY for Top1 → exists in mock
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });

  test("shows empty state when changing to selection with no data", () => {
    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);

    const accountDropdown = screen.getByRole("combobox");
    fireEvent.change(accountDropdown, { target: { value: "Top2" } });

    expect(screen.getByText("No data available for this selection")).toBeInTheDocument();
  });

  test("dropdown switches accounts correctly", () => {
    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);

    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "Top3" } });

    expect(screen.getByText("No data available for this selection")).toBeInTheDocument();
  });

  test("loading state displays correctly when hook returns isLoading", () => {
    // override mock for this test
    jest.mock("../../services/dashboardApi", () => ({
      useGetTotalProfitAndLossRelationshipDetailsQuery: jest.fn(() => ({
        isLoading: true,
      })),
    }));

    render(<TotalProfitAndLossRelation filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData} />);

    expect(screen.getByText("Loading chart...")).toBeInTheDocument();
  });

  test("clicking each time filter updates state and triggers rerender", () => {
  render(
    <TotalProfitAndLossRelation
      filterdtTotalProfiandLossRelationship={mockTotalProfitAndLossRelationData}
    />
  );

  const yoyBtn = screen.getByText("YoY");
  const momBtn = screen.getByText("MoM");
  const qoqBtn = screen.getByText("QoQ");

  // Click YoY → should show bar
  fireEvent.click(yoyBtn);
  expect(screen.getByTestId("bar")).toBeInTheDocument();

  // Click MoM → should show bar (covers setTimeFilter("MoM"))
  fireEvent.click(momBtn);
  expect(screen.getByTestId("bar")).toBeInTheDocument();

  // Click QoQ → should show bar (covers setTimeFilter("QoQ"))
  fireEvent.click(qoqBtn);
  expect(screen.getByTestId("bar")).toBeInTheDocument();
});

});
