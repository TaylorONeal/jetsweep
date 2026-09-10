import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { FlightForm } from "../src/components/FlightForm";
it("completes all three steps and submits the chosen options", async () => {
  const user = userEvent.setup({ delay: null });
  const submit = vi.fn();
  render(
    <FlightForm
      onSubmit={submit}
      initialInputs={{ departureDateTime: new Date(2030, 5, 10, 12) }}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Choose your departure airport",
  );
  await user.selectOptions(screen.getByLabelText("Departure airport"), "LAX");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.click(screen.getByRole("button", { name: "Car drop-off" }));
  fireEvent.change(screen.getByLabelText("Drive time (minutes)"), {
    target: { value: "47" },
  });
  await user.click(screen.getByRole("checkbox", { name: /Checking a bag/ }));
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.click(screen.getByRole("button", { name: "Extra time" }));
  await user.click(
    screen.getByRole("button", { name: "Build my departure plan" }),
  );
  expect(submit).toHaveBeenCalledOnce();
  expect(submit.mock.calls[0][0]).toMatchObject({
    airport: "LAX",
    transportType: "car",
    driveTime: 47,
    hasCheckedBag: true,
    riskPreference: "early",
  });
});
it("keeps options while moving backward through the wizard", async () => {
  const user = userEvent.setup({ delay: null });
  render(
    <FlightForm
      onSubmit={vi.fn()}
      initialInputs={{
        airport: "JFK",
        departureDateTime: new Date(2030, 5, 10, 12),
        driveTime: 62,
        hasPreCheck: true,
      }}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByLabelText("Drive time (minutes)")).toHaveValue(62);
  expect(screen.getByRole("checkbox", { name: /TSA PreCheck/ })).toBeChecked();
  await user.click(screen.getByRole("button", { name: "Previous step" }));
  expect(screen.getByLabelText("Departure airport")).toHaveValue("JFK");
});
