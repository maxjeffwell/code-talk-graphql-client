import React from 'react';

const ThemeSelect = (props) => {
  function triggerChangeTheme(e) {
    props.selectTheme(e.target.value)
  }

  function renderModeSelect() {
    const themes = [
      "monokai", "bespin", "3024-day", "3024-night",
      "cobalt", "eclipse", "dracula", "isotope",
      "duotone-light", "icecoder", "material",
      "midnight", "solarized",
    ];

    return themes.map((theme, i) => {
      if (theme === props.theme) {
        return <option key={i} value={theme} selected>{theme}</option>
      } else {
        return <option key={i} value={theme}>{theme}</option>
      }
    })
  }

    return (
      <form onChange={triggerChangeTheme}>
        <label>
          Select themes here
        </label>
        <form>
          {renderModeSelect()}
        </form>
      </form>
    );
  };


export default ThemeSelect;
