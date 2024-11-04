import { h } from 'preact';
import '../../styles/btnProgress.css';

const ProgressCheckbox = () => {
  return (
    <label className="container-progress">
      <input className="input-progress" type="checkbox" defaultChecked />
      <div className="checkmark-progress"></div>
    </label>
  );
};

export default ProgressCheckbox;
