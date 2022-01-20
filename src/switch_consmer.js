import React from 'react';
import 'Switch' from './Switch';

const SwitchComposer = ( props )=> {
  let [checked,setChecked] = useState(false);
  return (
    <div className="composer">
      <Switch label="Run All Cases" rounded="rounded" variant="primary" size="medium" rounded="rounded" checked={checked} onToggle={()=> setChecked(!checked)}/>
      </div>
  );
};

export default SwitchCOmposer;


import React from 'react';
import 'Switch' from './Switch';

export default class SwitchComposer  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked:false
    };
    
    this.handleToggleChange =
      this.handleToggleChange.bind(this);
  }

  handleToggleChange(checkedValue)
  {
    this.setState({checked:checkedValue});
  }
  render() {
    return (
    <div className="composer">
      <Switch label="Run All Cases" rounded="rounded" variant="primary" size="medium" rounded="rounded" checked={this.state.checked} onToggle={()=> this.handleToggleChange(!this.state.checked)}/>
      </div>
    )
  }
}

export default SwitchComposer;