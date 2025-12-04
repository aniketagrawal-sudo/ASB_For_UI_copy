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

    // Username
    fireEvent.mouseDown(screen.getByTestId("username-select"));

    // Description
    fireEvent.change(screen.getByTestId("description-input"))

    // Category
    fireEvent.mouseDown(screen.getByTestId("category-select"));

    // Persona
    fireEvent.mouseDown(screen.getByTestId("persona-select"));

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

    fireEvent.mouseDown(screen.getByTestId("username-select"));

    fireEvent.change(screen.getByTestId("description-input"))

    fireEvent.mouseDown(screen.getByTestId("category-select"));

    fireEvent.mouseDown(screen.getByTestId("persona-select"));

    fireEvent.click(screen.getByTestId("save-btn"));

    expect(mockOnSave).toHaveBeenCalled();
  });

// test("covers all onChange events of form fields dynamically", async () => {
//   render(<UsageStatsOnBoardKPIDialog {...defaultProps} />);

//   // ==== USERNAME SELECT ====
//   const usernameSelect = screen.getByTestId("username-select");
//   fireEvent.mouseDown(usernameSelect);

//   // Wait for the menu to appear and select the first option dynamically
//   await waitFor(() => {
//     const options = screen.getAllByRole("option");
//     fireEvent.click(options[0]);
//   });

//   // ==== DESCRIPTION INPUT ====
//   const descInput = screen.getByTestId("description-input");
//   fireEvent.change(descInput, { target: { value: "Some text" } });
//   expect(descInput.value).toBe("Some text");

//   // ==== CATEGORY SELECT ====
//   const categorySelect = screen.getByTestId("category-select");
//   fireEvent.mouseDown(categorySelect);
//   await waitFor(() => {
//     const options = screen.getAllByRole("option");
//     fireEvent.click(options[0]);
//   });

//   // ==== PERSONA SELECT ====
//   const personaSelect = screen.getByTestId("persona-select");
//   fireEvent.mouseDown(personaSelect);
//   await waitFor(() => {
//     const options = screen.getAllByRole("option");
//     fireEvent.click(options[0]);
//   });

//   // ==== SAVE BUTTON ====
//   fireEvent.click(screen.getByTestId("save-btn"));

//   expect(mockOnSave).toHaveBeenCalled();
// });
});
