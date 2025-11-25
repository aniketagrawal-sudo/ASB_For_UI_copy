import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import DepositLoan from "../../components/Dashboards/Trends/DepositLoan";
import { mockDepositData } from "../HomeDatasets/HomeDatasets";
import "@testing-library/jest-dom";

// Mock ResizeObserver (JSdom does NOT support it)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

import { mm, buildSeries } from "../../components/Dashboards/Trends/DepositLoan";

jest.mock("../../components/Dashboards/Trends/DepositLoan.module.scss", () => {
  return {
    chartHeader: "chartHeader",
    headerTitle: "headerTitle",
    segment: "segment",
    segmentItem: "segmentItem",
    segmentItemActive: "segmentItemActive",
    select: "select",
    card: "card",
    headerHr: "headerHr",
    badgeRowRight: "badgeRowRight",
    badge: "badge",
    chartBox: "chartBox",
    container: "container",
    row: "row",
    col: "col"
  };
});

// -----------------------------
describe("Utility Functions", () => {
  test("mm() returns min/max correctly", () => {
    expect(mm([5, 10, 2, 8])).toEqual({ min: 2, max: 10 });
  });

  test("mm() handles empty array", () => {
    expect(mm([])).toEqual({ min: 0, max: 0 });
  });

  test("buildSeries() formats labels and data", () => {
    const cfg = { labels: ["A", "B"], data: [10, 20] };
    expect(buildSeries(cfg)).toEqual([
      { label: "A", value: 10 },
      { label: "B", value: 20 }
    ]);
  });
});

// -----------------------------
describe("DepositLoan Component", () => {

  const mockLoanData = {
    MoM: { labels: ["Jan", "Feb"], data: [100, 200] },
    YoY: { labels: ["2020", "2021"], data: [300, 400] },
    QoQ: { labels: ["Q1", "Q2"], data: [500, 600] }
  };

  test("renders two TrendCard components", () => {
    render(<DepositLoan
      filterdDepositLoans={mockDepositData}
      filterdtLoansOutstanding={mockLoanData}
    />);

    expect(screen.getByText("Deposit Trends")).toBeInTheDocument();
    expect(screen.getByText("Loan Outstanding Trends")).toBeInTheDocument();
  });

  test("Account dropdown triggers loadData", async () => {
    render(<DepositLoan
      filterdDepositLoans={mockDepositData}
      // filterdtLoansOutstanding={mockLoanData}
    />);

    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "Acc No.2" } });

    await waitFor(() => {
      expect(select.value).toBe("Acc No.2");
    });
  });
});
