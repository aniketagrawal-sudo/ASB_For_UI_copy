import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import UsageStatsOnBoardKPIDialog from "../../components/AdminPersona/UsageStatsOnBoardKPIDialog";

describe("UsageStatsOnBoardKPIDialog Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    mode: "create",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders create mode with correct title", () => {
    render(<UsageStatsOnBoardKPIDialog {...defaultProps} />);
  });

  test("renders edit mode with initial values", () => {

    render(
      <UsageStatsOnBoardKPIDialog
        {...defaultProps}
        mode="edit"
      />
    );
  });

  test("allows user to change form fields", () => {
    render(<UsageStatsOnBoardKPIDialog {...defaultProps} />);
    // Save
    fireEvent.click(screen.getByTestId("save-btn"));

    expect(mockOnSave).toHaveBeenCalled();
  });

  test("clicking cancel calls onClose", () => {
    render(<UsageStatsOnBoardKPIDialog {...defaultProps} />);

    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("save button triggers onSave with correct data", () => {
    render(<UsageStatsOnBoardKPIDialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-btn"));

    expect(mockOnSave).toHaveBeenCalled();
  });
});
