import React, { useContext } from 'react'
import AlertContext from '../context/alert/AlertContext';

const Alert = () => {
  const context = useContext(AlertContext)
  const { alert } = context;
  const capitalize = (text) => {
    if (text === "danger") {
      text = "Error";
    }
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
    <div className="container my-3" style={{ height: '50px' }}>
      {alert &&
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          <strong>{capitalize(alert.type)}</strong>: {capitalize(alert.msg)}
        </div>}
    </div>
  )
}

export default Alert
