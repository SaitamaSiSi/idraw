type TypeScreenData = {
  scale: number;
  scrollLeft: number;
  scrollTop: number;
  // selectedElementUUID: string | null;
}

type TypeScreenPosition = {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

type TypeScreenSize = {
  x: number;
  y: number;
  w: number;
  h: number;
}

type TypeScreenContext = {
  size: TypeScreenSize,
  position: TypeScreenPosition
}

export {
  TypeScreenData,
  TypeScreenPosition,
  TypeScreenSize,
  TypeScreenContext,
};