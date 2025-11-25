/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { mockRevenueData } from "../HomeDatasets/HomeDatasets";
import RevenueGraph from "../../components/Dashboards/Trends/RevenueGraph";

// Mock SCSS imports
jest.mock("../../components/Dashboards/Trends/RevenueGraph.module.scss", () => {
  return {
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
  };
});

// Mock RTK Query Hook
jest.mock("../../services/dashboardApi", () => ({
  useGetRevenueGraphDetailsQuery: jest.fn(() => ({ isLoading: false })),
}));

// Mock ResizeObserver (Recharts requires this)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("RevenueGraph Component", () => {
  test("renders component container", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);
    expect(screen.getByTestId("revenue-graph")).toBeInTheDocument();
  });

  test("renders component title", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);
    expect(screen.getByTestId("title")).toHaveTextContent("Revenue");
  });

  test("default active filter should be YoY", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);
  
    const filterButtonsContainer = screen.getByTestId("filters");
    expect(filterButtonsContainer).toHaveTextContent("YoY");
  });

  test("switch to MoM updates the filter", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);

    const momButton = screen.getByText("MoM");
    fireEvent.click(momButton);

    expect(momButton.className).toContain("active");
  });

  test("switch to QoQ updates the filter", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);

    const qoqButton = screen.getByText("QoQ");
    fireEvent.click(qoqButton);

    expect(qoqButton.className).toContain("active");
  });

  test("dropdown default is Account Number 1", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);
    const dropdown = screen.getByTestId("account-dropdown");
    expect(dropdown.value).toBe("Account Number 1");
  });

  test("changing account updates dropdown", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);

    const dropdown = screen.getByTestId("account-dropdown");
    fireEvent.change(dropdown, { target: { value: "Account Number 3" } });

    expect(dropdown.value).toBe("Account Number 3");
  });

  test("renders divider", () => {
    render(<RevenueGraph revenueForClient={mockRevenueData} />);
    expect(screen.getByTestId("lowest")).toBeInTheDocument();
  });

});
