/**
 * NineSlice — Renders a 9-slice ImageLabel with configurable slice center.
 * Used for panel backgrounds, tooltips, and framed containers.
 *
 * @example
 * ```tsx
 * <NineSlice image="rbxassetid://12345" sliceCenter={new Rect(12, 12, 52, 52)} size={UDim2.fromScale(1, 1)} />
 * ```
 */

import React from '@rbxts/react';

export interface NineSliceProps {
  /** The image asset URI. */
  image: string;
  /** The slice center rect (Rect). */
  sliceCenter: Rect;
  /** Size of the nine-slice frame. */
  size?: UDim2;
  /** Position. */
  position?: UDim2;
  /** Anchor point. */
  anchorPoint?: Vector2;
  /** Image color tint. */
  imageColor?: Color3;
  /** Image transparency. */
  imageTransparency?: number;
  /** ZIndex. */
  zIndex?: number;
  /** Children rendered inside the nine-slice frame. */
  children?: React.Element;
}

export function NineSlice(props: NineSliceProps): React.Element {
  const {
    image,
    sliceCenter,
    size = UDim2.fromScale(1, 1),
    position,
    anchorPoint,
    imageColor,
    imageTransparency = 0,
    zIndex,
    children,
  } = props;

  return (
    <imagelabel
      key="NineSlice"
      Size={size}
      Position={position}
      AnchorPoint={anchorPoint}
      Image={image}
      ImageColor3={imageColor}
      ImageTransparency={imageTransparency}
      ScaleType={Enum.ScaleType.Slice}
      SliceCenter={sliceCenter}
      BackgroundTransparency={1}
      ZIndex={zIndex}
    >
      {children}
    </imagelabel>
  );
}
