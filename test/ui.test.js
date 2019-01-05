import React from "react";
import * as TestRenderer from "react-test-renderer";
import Board, { Cell } from "../src/ui";

describe("Board", () => {
  describe("Cell", () => {
    it("renders empty black correctly", () => {
      const cell = TestRenderer.create(<Cell color="black" />);
      expect(cell.toJSON()).toMatchInlineSnapshot(`
<div
  class="cell black"
/>
`);
    });

    it("renders empty white correctly", () => {
      const cell = TestRenderer.create(<Cell color="white" />);
      expect(cell.toJSON()).toMatchInlineSnapshot(`
<div
  class="cell white"
/>
`);
    });

    it("renders white man on white correctly", () => {
      const cell = TestRenderer.create(
        <Cell color="white" piece={{ color: "white", kind: "man" }} />
      );
      expect(cell.toJSON()).toMatchInlineSnapshot(`
<div
  class="cell white"
>
  <div
    class="piece white-piece man"
  />
</div>
`);
    });

    it("renders white king on white correctly", () => {
      const cell = TestRenderer.create(
        <Cell color="white" piece={{ color: "white", kind: "king" }} />
      );
      expect(cell.toJSON()).toMatchInlineSnapshot(`
<div
  class="cell white"
>
  <div
    class="piece white-piece king"
  />
</div>
`);
    });

    it("renders black man on white correctly", () => {
      const cell = TestRenderer.create(
        <Cell color="white" piece={{ color: "black", kind: "man" }} />
      );
      expect(cell.toJSON()).toMatchInlineSnapshot(`
<div
  class="cell white"
>
  <div
    class="piece black-piece man"
  />
</div>
`);
    });

    it("should require a color", () => {
      expect(() => TestRenderer.create(<Cell />)).toThrowError(
        "Warning: Failed prop type: The prop `color` is marked as required in `Cell`, but its value is `undefined`."
      );
    });

    it("should require a valid color", () => {
      expect(() => TestRenderer.create(<Cell color="invalid" />)).toThrowError(
        'Warning: Failed prop type: Invalid prop `color` of value `invalid` supplied to `Cell`, expected one of ["white","black"].'
      );
    });
  });

  it("renders correctly", () => {
    const board = TestRenderer.create(<Board />);
    expect(board.toJSON()).toMatchSnapshot();
  });
});
