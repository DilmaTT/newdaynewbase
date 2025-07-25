export interface ChartButton {
  id: string;
  name: string;
  color: string;
  linkedItem: string; // Can be a rangeId, chartId, or 'label-only'
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'label' | 'exit';
  isFontAdaptive?: boolean;
  fontSize?: number;
  fontColor?: 'white' | 'black';
}

export interface StoredChart {
  id: string;
  name: string;
  buttons: ChartButton[];
  canvasWidth?: number;
  canvasHeight?: number;
}
