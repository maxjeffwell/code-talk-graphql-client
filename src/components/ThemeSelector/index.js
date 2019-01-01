import React from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

const ThemeSelector = (props) => {
  function triggerChangeTheme(e) {
    props.changeTheme(e.target.value);
  }

  function renderModeSelect() {
    const themes = ["monokai", "bespin", "3024-day", "3024-night", "cobalt", "eclipse", "dracula", "isotope", "duotone-light", "icecoder", "material", "midnight", "solarized"];
    return themes.map((theme, i) => {
      if (theme === props.theme) {
        return <option key={i} value={theme} selected>{theme}</option>;
      } else {
        return <option key={i} value={theme}>{theme}</option>;
      }
    })
  }
  return (
    <FormGroup controlId="formControlsSelect" onChange={triggerChangeTheme}>
      <ControlLabel>Choose Theme</ControlLabel>
      <FormControl componentClass="select">
        {renderModeSelect()}
      </FormControl>
    </FormGroup>
  );
}

export default ThemeSelector;
