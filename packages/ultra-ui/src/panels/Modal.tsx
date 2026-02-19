/**
 * Modal — Centered overlay dialog with dim backdrop and confirm/cancel buttons.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={showConfirm}
 *   title="Confirm Trade"
 *   message="Trade 5 Gold for Iron Sword?"
 *   onConfirm={() => executeTrade()}
 *   onCancel={() => setShowConfirm(false)}
 * />
 * ```
 */

import React from '@rbxts/react';
import { useTheme } from '../theme';

export interface ModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Modal title. */
  title: string;
  /** Body message text. */
  message?: string;
  /** Confirm button label. Default: "Confirm". */
  confirmLabel?: string;
  /** Cancel button label. Default: "Cancel". */
  cancelLabel?: string;
  /** Callback when confirmed. */
  onConfirm?: () => void;
  /** Callback when cancelled. */
  onCancel?: () => void;
  /** Modal size. Default: 320×180. */
  size?: UDim2;
}

export function Modal(props: ModalProps): React.Element | undefined {
  const {
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    size = UDim2.fromOffset(320, 180),
  } = props;

  const theme = useTheme();

  if (!isOpen) return undefined;

  return (
    <React.Fragment>
      {/* Dim backdrop */}
      <frame
        key="ModalBackdrop"
        Size={UDim2.fromScale(1, 1)}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={theme.panel.overlayTransparency}
        BorderSizePixel={0}
        ZIndex={100}
      />

      {/* Modal card */}
      <frame
        key="ModalCard"
        AnchorPoint={new Vector2(0.5, 0.5)}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={size}
        BackgroundColor3={theme.panel.backgroundColor}
        BackgroundTransparency={theme.panel.backgroundTransparency}
        BorderSizePixel={0}
        ZIndex={101}
      >
        <uicorner CornerRadius={theme.panel.cornerRadius} />
        <uistroke Color={theme.panel.borderColor} Thickness={theme.panel.borderThickness} />

        {/* Title */}
        <textlabel
          key="Title"
          Position={new UDim2(0, 16, 0, 12)}
          Size={new UDim2(1, -32, 0, 24)}
          BackgroundTransparency={1}
          Text={title}
          TextColor3={theme.panel.titleTextColor}
          TextXAlignment={Enum.TextXAlignment.Center}
          TextSize={18}
          Font={Enum.Font.GothamBold}
          ZIndex={102}
        />

        {/* Message */}
        {message !== undefined && (
          <textlabel
            key="Message"
            Position={new UDim2(0, 16, 0, 44)}
            Size={new UDim2(1, -32, 1, -100)}
            BackgroundTransparency={1}
            Text={message}
            TextColor3={theme.textColor}
            TextWrapped={true}
            TextSize={14}
            Font={Enum.Font.GothamMedium}
            ZIndex={102}
          />
        )}

        {/* Buttons */}
        <frame
          key="ButtonRow"
          AnchorPoint={new Vector2(0.5, 1)}
          Position={new UDim2(0.5, 0, 1, -12)}
          Size={new UDim2(1, -32, 0, 36)}
          BackgroundTransparency={1}
          ZIndex={102}
        >
          <uilistlayout
            FillDirection={Enum.FillDirection.Horizontal}
            HorizontalAlignment={Enum.HorizontalAlignment.Center}
            Padding={new UDim(0, 12)}
          />

          {/* Cancel */}
          {onCancel !== undefined && (
            <textbutton
              key="CancelBtn"
              Size={new UDim2(0, 120, 1, 0)}
              BackgroundColor3={Color3.fromRGB(80, 80, 90)}
              BackgroundTransparency={0.2}
              Text={cancelLabel}
              TextColor3={Color3.fromRGB(220, 220, 220)}
              TextSize={14}
              Font={Enum.Font.GothamBold}
              BorderSizePixel={0}
              Event={{ Activated: () => onCancel() }}
            >
              <uicorner CornerRadius={new UDim(0, 6)} />
            </textbutton>
          )}

          {/* Confirm */}
          {onConfirm !== undefined && (
            <textbutton
              key="ConfirmBtn"
              Size={new UDim2(0, 120, 1, 0)}
              BackgroundColor3={Color3.fromRGB(60, 160, 80)}
              BackgroundTransparency={0.1}
              Text={confirmLabel}
              TextColor3={Color3.fromRGB(255, 255, 255)}
              TextSize={14}
              Font={Enum.Font.GothamBold}
              BorderSizePixel={0}
              Event={{ Activated: () => onConfirm() }}
            >
              <uicorner CornerRadius={new UDim(0, 6)} />
            </textbutton>
          )}
        </frame>
      </frame>
    </React.Fragment>
  );
}
