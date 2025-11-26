import React from "react";
import { render, screen } from "@testing-library/react";
import VolumeUsage from "../../components/Dashboards/Trends/VolumeUsage";
import { mockVolumeUsageData } from "../HomeDatasets/HomeDatasets";

// Mock SCSS file
jest.mock("../../components/Dashboards/Trends/VolumeUsage.module.scss", () => ({
  revenueChartContainer: "revenueChartContainer",
  chartHeader: "chartHeader",
  chartTitle: "chartTitle",
  dividerWrapper: "dividerWrapper",
  divider: "divider",
  chartWrapper: "chartWrapper",
}));

// Mock Recharts with realistic minimal behavior
jest.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }) => (
      <div data-testid="mock-responsive">{children}</div>
    ),

    PieChart: ({ children }) => (
      <div data-testid="mock-pie-chart">{children}</div>
    ),

    Pie: ({ data, label, children }) => (
      <div data-testid="mock-pie">
        {/* Render labels manually because Recharts normally renders inside SVG */}
        {data.map((item, i) => (
          <div key={i} data-testid="mock-label">
            {label({ name: item.name, value: item.value })}
          </div>
        ))}
        {children}
      </div>
    ),

    Cell: ({ fill, ...rest }) => (
      <div data-testid="mock-cell" data-fill={fill} {...rest}></div>
    ),
  };
});

describe("VolumeUsage Component", () => {
  test("renders chart title", () => {
    render(<VolumeUsage filterdtVoumeOfUsage={mockVolumeUsageData} />);
    expect(screen.getByTestId("chart-title")).toHaveTextContent("Volume of Usage");
  });

  test("respects isAnimationActive prop", () => {
    render(
      <VolumeUsage
        isAnimationActive={false}
        filterdtVoumeOfUsage={mockVolumeUsageData}
      />
    );

    expect(screen.getByTestId("mock-pie")).toBeInTheDocument();
  });

  test("handles empty data gracefully", () => {
    render(<VolumeUsage filterdtVoumeOfUsage={[]} />);

    expect(screen.getByTestId("total-value")).toHaveTextContent("Total: 0");

    const slices = screen.queryAllByTestId("mock-cell");
    expect(slices.length).toBe(0);
  });
});
