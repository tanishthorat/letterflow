export interface LayoutPreset {
  id: string;
  label: string;
  columns: number[];
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  { id: "1col", label: "1 Column", columns: [1] },
  { id: "2col", label: "2 Columns", columns: [1, 1] },
  { id: "3col", label: "3 Columns", columns: [1, 1, 1] },
  { id: "4col", label: "4 Columns", columns: [1, 1, 1, 1] },
  { id: "5col", label: "5 Columns", columns: [1, 1, 1, 1, 1] },
  { id: "6col", label: "6 Columns", columns: [1, 1, 1, 1, 1, 1] },
  { id: "2col-left", label: "Left Heavy", columns: [2, 1] },
  { id: "2col-right", label: "Right Heavy", columns: [1, 2] },
  { id: "3col-left", label: "3 Col Left Heavy", columns: [2, 1, 1] },
  { id: "3col-right", label: "3 Col Right Heavy", columns: [1, 1, 2] },
];