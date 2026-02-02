import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: any) => <div>{children}</div>,
  Popup: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("leaflet", () => ({
  Icon: function Icon() {},
}));

test("renders travel planner title", () => {
  render(<App />);
  expect(screen.getByText(/planificator de călătorii/i)).toBeInTheDocument();
});
