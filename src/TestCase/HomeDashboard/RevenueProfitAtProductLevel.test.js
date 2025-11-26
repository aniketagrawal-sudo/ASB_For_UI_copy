import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RevenueProfitAtProductLevel from "../../components/Dashboards/Trends/RevenueProfitAtProductLevel";
import { mokeRevenueProfitProductLevel } from "../HomeDatasets/HomeDatasets";

// ---- Mock SCSS modules ----
jest.mock("../../components/Dashboards/Trends/RevenueProfitAtProductLevel.module.scss", () => ({
  revenueChartContainer: "revenueChartContainer",
  chartHeader: "chartHeader",
  chartTitle: "chartTitle",
  chartControls: "chartControls",
  accountDropdown: "accountDropdown",
  dropdownSelect: "dropdownSelect",
  dropdownIcon: "dropdownIcon",
  dividerWrapper: "dividerWrapper",
  divider: "divider",
  chartWrapper: "chartWrapper",
}));

// ---- Mock Recharts to avoid JS-DOM errors ----
jest.mock("recharts", () => {
  const Mock = ({ children }) => <div data-testid="mock-chart">{children}</div>;
  return {
    BarChart: Mock,
    Bar: () => <div data-testid="bar"></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>,
  };
});

describe("RevenueProfitAtProductLevel Component", () => {
  test("renders title correctly", () => {
    render(<RevenueProfitAtProductLevel filterdtRevenueProfirPrductLevel={mokeRevenueProfitProductLevel} />);
    expect(screen.getByText("Revenue and Profit at Product Level")).toBeInTheDocument();
  });

  test("renders BarChart when not loading", () => {
    render(<RevenueProfitAtProductLevel filterdtRevenueProfirPrductLevel={mokeRevenueProfitProductLevel} />);
    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
  });

  test("renders loading state when API is fetching", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mokeRevenueProfitProductLevel),
      })
    );

    render(
      <RevenueProfitAtProductLevel
        apiUrl="https://dummyapi.com/data"
        filterdtRevenueProfirPrductLevel={mokeRevenueProfitProductLevel}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("handles empty dataset gracefully", () => {
    render(<RevenueProfitAtProductLevel filterdtRevenueProfirPrductLevel={[]} />);

    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
  });
});
