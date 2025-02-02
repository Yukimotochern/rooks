import { renderHook, act } from "@testing-library/react-hooks";
import { useSelectableList } from "../hooks/useSelectableList";

jest.spyOn(console, "warn").mockImplementation(jest.fn);

describe("useSelctableList", () => {
  afterEach(() => {
    (console.warn as jest.Mock).mockReset();
  });
  const { result } = renderHook(() => useSelectableList([1, 2, 3]));

  describe("matchSelection", () => {
    it("console.warn", () => {
      act(() => {
        result.current[1].matchSelection({ index: 1, value: 2 });
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "matchSelection. Expected either index or value to be provided. However all were provided"
      );
      act(() => {
        result.current[1].matchSelection({});
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        "matchSelection. index , value are all undefined."
      );
    });

    it("match index", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, true)
      );
      expect(internalResult.current[1].matchSelection({ index: 0 })).toBe(true);
      expect(internalResult.current[1].matchSelection({ index: 1 })).toBe(
        false
      );
    });

    it("match value", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, true)
      );
      expect(internalResult.current[1].matchSelection({ value: 1 })).toBe(true);
      expect(internalResult.current[1].matchSelection({ value: 2 })).toBe(
        false
      );
    });
  });

  describe("updateSelection", () => {
    it("set by index", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, true)
      );

      act(() => {
        internalResult.current[1].updateSelection({ index: 1 })();
      });
      const [currentIndex, currentValue] = internalResult.current[0];
      expect(currentIndex).toBe(1);
      expect(currentValue).toBe(2);
    });
    it("set by value", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, true)
      );

      act(() => {
        internalResult.current[1].updateSelection({ value: 2 })();
      });
      const [currentIndex, currentValue] = internalResult.current[0];
      expect(currentIndex).toBe(1);
      expect(currentValue).toBe(2);
    });

    it("set by value fail", () => {
      const [beforeIndex, beforeValue] = result.current[0];
      act(() => {
        result.current[1].updateSelection({ value: 22 })();
      });
      const [afterIndex, afterValue] = result.current[0];
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "updateSelection failed. Does the value 22 exist in the list?"
      );
      (console.warn as jest.Mock).mockReset();

      // default
      expect(beforeIndex).toBe(afterIndex);
      expect(beforeValue).toBe(afterValue);
    });

    it("console.warn", () => {
      act(() => {
        result.current[1].updateSelection({ index: 1, value: 2 })();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "updateSelection. Expected either index or value to be provided. However all were provided"
      );
      act(() => {
        result.current[1].updateSelection({})();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        "updateSelection. index , value are all undefined."
      );
    });
  });

  describe("toggleSelection", () => {
    it("should toggle selected index", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, true)
      );
      act(() => {
        internalResult.current[1].toggleSelection({ index: 0 })();
      });
      const [currentIndex, currentValue] = internalResult.current[0];
      expect(currentIndex).toBe(-1);
      expect(currentValue).toBe(undefined);
    });

    it("shouldn't toggle selected index when allowUnselected = false", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, false)
      );
      const [beforeIndex, beforeValue] = internalResult.current[0];
      act(() => {
        internalResult.current[1].toggleSelection({ index: 0 })();
      });
      const [afterIndex, afterValue] = internalResult.current[0];

      // default
      expect(beforeIndex).toBe(afterIndex);
      expect(beforeValue).toBe(afterValue);
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "allowUnselected is false. Cannot unselect item"
      );
      (console.warn as jest.Mock).mockReset();
    });
    it("should toggle selected value", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, true)
      );
      act(() => {
        internalResult.current[1].toggleSelection({ value: 1 })();
      });

      const [currentIndex, currentValue] = internalResult.current[0];

      expect(currentIndex).toBe(-1);
      expect(currentValue).toBe(undefined);
    });

    it("shouldn't toggle selected value when allowUnselected", () => {
      const { result: internalResult } = renderHook(() =>
        useSelectableList([1, 2, 3], 0, false)
      );
      const [beforeIndex, beforeValue] = internalResult.current[0];
      act(() => {
        internalResult.current[1].toggleSelection({ value: 1 })();
      });
      const [afterIndex, afterValue] = internalResult.current[0];

      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "allowUnselected is false. Cannot unselect item"
      );
      // default
      expect(beforeIndex).toBe(afterIndex);
      expect(beforeValue).toBe(afterValue);
      (console.warn as jest.Mock).mockReset();
    });

    it("console.warn", () => {
      act(() => {
        result.current[1].toggleSelection({ index: 1, value: 2 })();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        1,
        "toggleSelection. Expected either index or value to be provided. However all were provided"
      );
      act(() => {
        result.current[1].toggleSelection({})();
      });
      expect(console.warn).toHaveBeenNthCalledWith(
        2,
        "toggleSelection. index , value are all undefined."
      );
    });
  });
});
