interface IDrawContext {
  getContext(): CanvasRenderingContext2D;
  setTransform(config: {
    scale?: number;
    scrollX?: number;
    scrollY?: number;
  }): void;
  getTransform(): {
    scale: number;
    scrollX: number;
    scrollY: number;
  }
  getSize(): {
    width: number;
    height: number;
    contextWidth: number;
    contextHeight: number;
    devicePixelRatio: number;
  };
  resetSize(opts: {
    width?: number;
    height?: number;
    contextWidth?: number;
    contextHeight?: number;
    devicePixelRatio?: number;
  }): void;
  calcDeviceNum(num: number): number;
  calcScreenNum(num: number): number;

  setFillStyle(color: string | CanvasPattern): void;
  fill(fillRule?: CanvasFillRule | undefined): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean | undefined): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  setLineWidth(w: number): void;
  setLineDash(nums: number[]): void;
  isPointInPath(x: number, y: number): boolean;
  isPointInPathWithoutScroll(x: number, y: number): boolean;
  setStrokeStyle(color: string): void;
  stroke(): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  measureText(text: string): TextMetrics;
  setTextAlign(align: CanvasTextAlign): void;
  fillText(text: string, x: number, y: number, maxWidth?: number | undefined): void;
  strokeText(text: string, x: number, y: number, maxWidth?: number | undefined): void;
  setFont(opts: { fontSize: number, fontFamily?: string, fontWeight?: string }): void
  setTextBaseline(baseline: CanvasTextBaseline): void;
  save(): void;
  restore(): void;
  scale(ratioX: number, ratioY: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null;
  setGlobalAlpha(alpha: number): void;
  setShadowColor(color: string): void;
  setShadowOffsetX(offsetX: number): void;
  setShadowOffsetY(offsetY: number): void;
  setShadowBlur(blur: number): void;
  ellipse(x: number,y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined): void
}

export {
  IDrawContext
};