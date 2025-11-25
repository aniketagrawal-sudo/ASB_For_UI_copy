/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import ClinetInformationComponent from "../../components/Dashboards/Trends/ClinetInformationComponent";
import {mockClientInformationComponentsData} from '../HomeDatasets/HomeDatasets';

// Mock SCSS
jest.mock("../../Dashboards/Trends/ClinetInformationComponent.module.scss", () => {
  return new Proxy({}, { get: (_, key) => key });
});

// Mock MUI Tooltip Portal behavior
jest.mock("@mui/material", () => {
  const original = jest.requireActual("@mui/material");
  return {
    ...original,
    Tooltip: ({ children }) => children,
  };
});

describe("ClinetInformationComponent", () => {
  test("renders Account Details section header", () => {
    render(<ClinetInformationComponent filteredAccountDetails={mockClientInformationComponentsData} />);
    expect(screen.getByText("Account Details")).toBeInTheDocument();
  });

  test("renders table headers correctly", () => {
    render(<ClinetInformationComponent filteredAccountDetails={mockClientInformationComponentsData} />);

    const expectedHeaders = [
      "Account No.",
      "Opening Date",
      "Risk Rating",
      "Closing Date",
      "Status",
      "Account Type",
      "Current Balance",
      "Interest Rate",
    ];

    expectedHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  test("renders Other ASB Teams Connected section", () => {
    render(<ClinetInformationComponent filteredAccountDetails={mockClientInformationComponentsData} />);
    expect(screen.getByText("Other ASB Teams Connected")).toBeInTheDocument();
  });

  test("renders Info icons", () => {
    render(<ClinetInformationComponent filteredAccountDetails={mockClientInformationComponentsData} />);

    const icons = screen.getAllByRole("button");
    expect(icons.length).toBeGreaterThan(0);
  });
});
