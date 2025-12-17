import React from "react";
import { render, screen } from "@testing-library/react";
import { Chart3Tooltip, UsageStatsChartThreeTrends } from "../../components/AdminPersona/UsageStatsChartThreeTrends";
import { UsageStatsChartThreeTrendsMock } from "../HomeDatasets/AdminKPIDatasets";

jest.mock("recharts", () => {
  const React = require("react");

  const ResponsiveContainer = ({ children }) => <div data-testid="responsive-container">{children}</div>;

  const BarChart = ({ data, children }) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(data || [])}>
      {children}
    </div>
  );

  const Bar = ({ children }) => <div data-testid="bar">{children}</div>;
  const Cell = ({ fill }) => <div data-testid="cell" data-fill={fill} />;

  const XAxis = (props) => <div data-testid="x-axis" data-props={JSON.stringify(props || {})} />;
  const YAxis = (props) => <div data-testid="y-axis" data-props={JSON.stringify(props || {})} />;
  const CartesianGrid = () => <div data-testid="cartesian-grid" />;
  const Tooltip = (props) => <div data-testid="tooltip" data-props={JSON.stringify(props || {})} />;
  
  return {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
  };
});

jest.mock("react-redux", () => {
  return {
    useSelector: jest.fn(),
  };
});

import { useSelector } from "react-redux";

beforeEach(() => {
  jest.clearAllMocks();
  useSelector.mockImplementation((selectorFn) => {
    return UsageStatsChartThreeTrendsMock;
  });
});

describe("UsageStatsChartThreeTrends - rendering & filtering", () => {
  test("renders header 'Chart 3'", () => {
    render(<UsageStatsChartThreeTrends />);
    expect(screen.getByText("Chart 3")).toBeInTheDocument();
  });

  test("renders BarChart with all data by default (filter 'All')", () => {
    render(<UsageStatsChartThreeTrends />);

    const barChart = screen.getByTestId("bar-chart");
    const dataAttr = barChart.getAttribute("data-data");
    expect(dataAttr).toBeTruthy();

    const parsed = JSON.parse(dataAttr);
    expect(Array.isArray(parsed)).toBe(true);
    // default should include all 3 entries
    expect(parsed).toHaveLength(3);
    expect(parsed.map((d) => d.name)).toEqual(["Persona 1", "Persona 2", "Persona 3"]);
  });
});

describe("Chart3Tooltip", () => {
  test("returns null when inactive", () => {
    const { container } = render(<Chart3Tooltip active={false} payload={[]} filter="All" />);
    expect(container.firstChild).toBeNull();
  });

  test("renders tooltip content correctly", () => {
    const payload = [
      {
        payload: {
          name: "Persona 1",
          users: 100,
          avgTimeSpent: 5,
        },
      },
    ];

    render(<Chart3Tooltip active={true} payload={payload} filter="Active" />);

    expect(screen.getByText("Persona 1")).toBeInTheDocument();
    expect(screen.getByText("Active Users:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("5 hours")).toBeInTheDocument();
  });
});
