/**
 * Icon — Renders an ImageLabel sized to fit.
 * Accepts an ImageAsset string (rbxassetid://...) or raw string.
 *
 * @example
 * ```tsx
 * <Icon image="rbxassetid://12345" size={UDim2.fromOffset(32, 32)} />
 * ```
 */

import React from '@rbxts/react';

export interface IconProps {
  /** The image asset URI (rbxassetid://...). */
  image: string;
  /** Size of the icon. Default: 32×32 offset. */
  size?: UDim2;
  /** Image color tint. */
  imageColor?: Color3;
  /** Image transparency (0 = opaque). */
  imageTransparency?: number;
  /** Layout order for list layouts. */
  layoutOrder?: number;
  /** ZIndex. */
  zIndex?: number;
}

export function Icon(props: IconProps): React.Element {
  const {
    image,
    size = UDim2.fromOffset(32, 32),
    imageColor,
    imageTransparency = 0,
    layoutOrder,
    zIndex,
  } = props;

  return (
    <imagelabel
      key="Icon"
      Size={size}
      Image={image}
      ImageColor3={imageColor}
      ImageTransparency={imageTransparency}
      BackgroundTransparency={1}
      ScaleType={Enum.ScaleType.Fit}
      LayoutOrder={layoutOrder}
      ZIndex={zIndex}
    />
  );
}
