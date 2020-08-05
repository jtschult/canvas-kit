import {spacing} from '@workday/canvas-kit-react-core';
import {checkIcon} from '@workday/canvas-system-icons-web';
import {ColorInput} from '@workday/canvas-kit-react-color-picker';
import {IconButton} from '@workday/canvas-kit-react-button';
import {Popup} from '@workday/canvas-kit-react-popup';
import * as React from 'react';
import FormField from '@workday/canvas-kit-react-form-field';
import styled from '@emotion/styled';

import {ResetButton} from './parts/ColorReset';
import {SwatchBook} from './parts/SwatchBook';
import {defaultColorSet} from './parts/ColorSets';

export interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The function called when the ColorPicker state changes.
   */
  onColorChange: (color: string) => void;
  /**
   * The value of the ColorPicker.
   */
  value?: string;
  /**
   * The array of colors to be rendered in the swatchbook.
   */
  colorSet?: string[];
  /**
   * If true, render an input for entering a custom hex color.
   * @default false
   */
  showCustomHexInput?: boolean;
  /**
   * The label text of the custom hex input.
   * @default 'Custom Hex Color'
   */
  customHexInputLabel?: string;
  /**
   * The label of the custom hex color submit icon button.
   * @default 'Submit'
   */
  submitLabel?: string;
  /**
   * The function called when the submit icon is clicked.
   */
  onSubmitClick?: (event: React.FormEvent) => void;
  /**
   * The function called when the color rest button is selected.
   * It is required to be set for the reset button to render.
   */
  onColorReset?: (color: string) => void;
  /**
   * The color that the reset button resets to.
   * It is required to be set for the reset button to render.
   */
  resetColor?: string;
  /**
   * The label text of the reset button.
   * @default 'Reset'
   */
  resetLabel?: string;
}

const ColorInputWrapper = styled('form')({
  width: '100%',
  marginTop: spacing.s,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const ColorInputAndLabel = styled(FormField)({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
});

const CheckButton = styled(IconButton)({
  alignSelf: 'flex-end',
});

const HexColorInput = styled(ColorInput)({
  width: '168px',
});

const isCustomColor = (colors: string[], hexCode?: string) => {
  if (!hexCode) {
    return false;
  }

  const lowercaseHex = hexCode.toLowerCase();
  return !colors.includes(lowercaseHex);
};

const ColorPicker = ({
  colorSet = defaultColorSet,
  customHexInputLabel = 'Custom Hex Color',
  submitLabel = 'Submit',
  onColorChange,
  onColorReset,
  onSubmitClick,
  resetLabel = 'Reset',
  resetColor,
  value = '',
  showCustomHexInput = false,
  ...elemProps
}: ColorPickerProps) => {
  const [validHexValue, setValidHexValue] = React.useState('');
  const [customHexValue, setCustomHexValue] = React.useState(
    isCustomColor(colorSet, value) ? value : ''
  );

  const onCustomHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHexValue(event.target.value);
    setValidHexValue('');
  };

  const onValidCustomHexChange = (validHexValue: string) => setValidHexValue(validHexValue);

  const onSubmit = (event: React.FormEvent) => {
    if (onSubmitClick) {
      onSubmitClick(event);
    }
    onColorChange(validHexValue);
    event.preventDefault(); // don't submit the form - default action is to reload the page
  };

  return (
    <Popup width={250} padding={Popup.Padding.s} data-testid="canvas-color-picker" {...elemProps}>
      {onColorReset && resetColor && (
        <ResetButton onClick={onColorReset} resetColor={resetColor} label={resetLabel} />
      )}
      <SwatchBook colors={colorSet} onSelect={onColorChange} value={value} />
      {showCustomHexInput && (
        <ColorInputWrapper onSubmit={onSubmit}>
          <ColorInputAndLabel label={customHexInputLabel}>
            <HexColorInput
              onChange={onCustomHexChange}
              onValidColorChange={onValidCustomHexChange}
              value={customHexValue}
              showCheck={value === validHexValue || value === customHexValue}
            />
          </ColorInputAndLabel>
          <CheckButton
            aria-label={submitLabel}
            variant={IconButton.Variant.CircleFilled}
            icon={checkIcon}
          />
        </ColorInputWrapper>
      )}
    </Popup>
  );
};

export default ColorPicker;
