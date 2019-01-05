import React from "react";
import * as TestRenderer from "react-test-renderer";
import ShallowRenderer from 'react-test-renderer/shallow';
import each from 'jest-each';

import Board, { Square } from "../src/ui";

describe("Board", () => {
  describe("Square", () => {
    it("renders empty black correctly", () => {
      const square = TestRenderer.create(<Square color="black" />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black"
/>
`);
    });

    it("renders empty white correctly", () => {
      const square = TestRenderer.create(<Square color="white" />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
/>
`);
    });

    it("renders white man on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "white", kind: "man" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece white-piece man"
  />
</div>
`);
    });

    it("renders white king on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "white", kind: "king" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece white-piece king"
  />
</div>
`);
    });

    it("renders black man on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "black", kind: "man" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece black-piece man"
  />
</div>
`);
    });

    it("should require a color", () => {
      expect(() => TestRenderer.create(<Square />)).toThrowError(
        "Warning: Failed prop type: The prop `color` is marked as required in `Square`, but its value is `undefined`."
      );
    });

    it("should require a valid color", () => {
      expect(() =>
        TestRenderer.create(<Square color="invalid" />)
      ).toThrowError(
        'Warning: Failed prop type: Invalid prop `color` of value `invalid` supplied to `Square`, expected one of ["white","black"].'
      );
    });
  });

  it("renders correctly when empty", () => {
    const board = TestRenderer.create(<Board pieces={ Array(64).fill(null) } />);
    expect(board.toJSON()).toMatchSnapshot();
  });

  const allSquareIndices = Array(64).fill().map((_, i) => i);

  each(allSquareIndices).it("renders white man correctly in square %d", (index) => {
    const pieces = Array(64).fill(null)
    const whiteMan = { color: "white", kind: "man" };
    pieces[index] = whiteMan
    const board = new ShallowRenderer().render(<Board pieces={ pieces } />);
    expect(board.props.children[index].props).toMatchObject({ piece: whiteMan })
  })
});
