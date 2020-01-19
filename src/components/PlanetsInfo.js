import React from 'react';
import closeIcon from "./../icon-close-white.png"

const PlanetsInfo = (props) => {
  const {planet = {}, show, handleClose} = props;

  if(!planet || !show){
    return null;
  }

  return (
    <div className="planetInfo pof bxrd4">
      <div >
        <span className="fs40 clrw"><b>{planet.name}</b></span>
        <img alt="close" src={closeIcon} className="closeIco poa" onClick={handleClose}/>
        <div>
          <p className="fs14 clrw" >Population: <b>{planet.population}</b>.</p>
          <p className="fs14 clrw">Rotation period: <b>{planet.rotation_period} days</b></p>
          <p className="fs14 clrw">Orbital period: <b>{planet.orbital_period} days</b></p>
        </div>
      </div>
    </div>
  );
}

export default PlanetsInfo;
