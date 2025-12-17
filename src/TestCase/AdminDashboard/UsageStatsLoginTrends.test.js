import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { UsageStatsLoginTrends } from "../../components/AdminPersona/UsageStatsLoginTrends";
import { UsageStatsLoginTrendsMock } from "../HomeDatasets/AdminKPIDatasets";

jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
  };
});

function createMockStore(state) {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
}

function renderWithStore() {
  const store = createMockStore({
    admin: { loginTrendsData: UsageStatsLoginTrendsMock },
    selectAdminUsageStatsLoginTrends: UsageStatsLoginTrendsMock,
  });

  return render(
    <Provider store={store}>
      <UsageStatsLoginTrends />
    </Provider>
  );
}

describe("UsageStatsLoginTrends Component", () => {
  
  test("renders Login Trends header", () => {
    renderWithStore();
    expect(screen.getByText("Login Trends")).toBeInTheDocument();
  });

  test("renders dropdown with default '6 Months'", () => {
    renderWithStore();
    expect(screen.getByLabelText("Period")).toHaveTextContent("6 Months");
  });

  test("changes period to '3 Months' and updates chart", () => {
    renderWithStore();

    const dropdown = screen.getByLabelText("Period");
    
    fireEvent.mouseDown(dropdown);
    fireEvent.click(screen.getByText("3 Months"));

    expect(dropdown).toHaveTextContent("3 Months");
  });

  test("changes period to '1 Month' and updates chart", () => {
    renderWithStore();

    const dropdown = screen.getByLabelText("Period");
    
    fireEvent.mouseDown(dropdown);
    fireEvent.click(screen.getByText("1 Month"));
  });
});
