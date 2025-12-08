// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { UsageStatsTimespent } from "../../components/AdminPersona/UsageStatsTimespent";
import { UsageStatsTimespentMock } from "../HomeDatasets/AdminKPIDatasets";

jest.mock("../../redux/store/adminSlice", () => ({
  selectAdminUsageStatsTimeSpentBar: jest.fn(),
}));

import { selectAdminUsageStatsTimeSpentBar } from "../../redux/store/adminSlice";

import { CustomTooltip } from "../../components/AdminPersona/UsageStatsTimespent";

const mockPayload = [
  {
    payload: {
      name: "Dashboard",
      activeUsers: 120,
      avgTimeSpent: 4,
    },
  },
];
// selector mocked return
selectAdminUsageStatsTimeSpentBar.mockImplementation(
  () => UsageStatsTimespentMock
);

function createMockStore(state) {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
}

function renderWithStore() {
  const store = createMockStore({
    admin: { usageStatsTimeSpentBar: UsageStatsTimespentMock },
  });

  render(
    <Provider store={store}>
      <UsageStatsTimespent />
    </Provider>
  );
}

describe("UsageStatsTimespent", () => {
  test("renders dropdown with default 'Day'", () => {
    renderWithStore();
    const dropdown = screen.getByTestId("timespent-dropdown");
    expect(dropdown).toHaveTextContent("Day");
  });

  
   test("returns null when not active", () => {
    const { container } = render(<CustomTooltip active={false} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders tooltip correctly when active with payload", () => {
    render(<CustomTooltip active={true} payload={mockPayload} />);

    // name
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // active users
    expect(screen.getByText(/Total Users:/i)).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();

    // avg time
    expect(screen.getByText(/Avg Time Spent:/i)).toBeInTheDocument();
    expect(screen.getByText(/4 hours/)).toBeInTheDocument();
  });
});
