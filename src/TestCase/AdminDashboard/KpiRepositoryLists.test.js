import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import KpiRepositoryLists from "../../components/AdminPersona/KpiRepositoryLists.jsx";
import { adminKpilistData } from "../HomeDatasets/AdminKPIDatasets.js";
import { useGetInsightDetailsQuery } from "../../services/dashboardApi.js";

jest.mock("../../services/dashboardApi", () => ({
  api: {
    injectEndpoints: () => ({
      useGetInsightDetailsQuery: jest.fn(() => ({
        data: [],
        isLoading: false,
      })),
    }),
  },
}));


// Mock Redux selector
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock icons to avoid unnecessary complexity in tests
jest.mock("@mui/icons-material/ArrowUpward", () => () => <div data-testid="arrow-up" />);
jest.mock("@mui/icons-material/ArrowDownward", () => () => <div data-testid="arrow-down" />);

describe("KpiRepositoryLists Component", () => {
  beforeEach(() => {
    useSelector.mockReturnValue(adminKpilistData);
  });

  test("renders all KPI cards", () => {
    render(<KpiRepositoryLists />);

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Customer Drop")).toBeInTheDocument();
  });

  test("renders KPI values correctly", () => {
    render(<KpiRepositoryLists />);

    expect(screen.getByText("230K")).toBeInTheDocument();
    expect(screen.getByText("5K")).toBeInTheDocument();
  });

  test("renders correct change text", () => {
    render(<KpiRepositoryLists />);

    expect(screen.getByText("(12%)")).toBeInTheDocument();
    expect(screen.getByText("(8%)")).toBeInTheDocument();
  });

  test("renders upward arrow for positive KPIs", () => {
    render(<KpiRepositoryLists />);

    expect(screen.getAllByTestId("arrow-up").length).toBe(1);
  });

  test("renders downward arrow for negative KPIs", () => {
    render(<KpiRepositoryLists />);

    expect(screen.getAllByTestId("arrow-down").length).toBe(1);
  });

  test("renders correct number of KPI cards", () => {
    render(<KpiRepositoryLists />);

    const titles = screen.getAllByRole("heading", { level: 3 }); // h3 elements
    expect(titles.length).toBe(2);
  });
});
