import React from 'react';

const ModeSelector = (props) => {
  function triggerChangeMode(e) {
    props.changeMode(e.target.value)
  }

  function renderModeSelector() {
    const modes = [
      "ruby", "javascript", "clojure",
      "coffeescript", "crystal", "erlang",
      "php", "python", "swift"
    ];

    return modes.map((mode, i) => {
      if (mode === props.mode) {
        return <option key={i} value={mode} selected>{mode}</option>
      } else {
        return <option key={i} value={mode}>{mode}</option>
      }
    });
  }

  return (
    <form onChange={triggerChangeMode}>
      <label>Change language</label>
      <form>
        {renderModeSelector()}
      </form>
    </form>
  );
};

export default ModeSelector;
