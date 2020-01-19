import React, { Component } from 'react';

class List extends Component {


  calculateTextSize = (planet, items) => {
    const maxDisplaySize = 70

    let populationArr = items.map(item => item.population).filter(item => !isNaN(item)).map(item => parseInt(item))
    let maxPlanetPop = Math.max(...populationArr)

    let relativePlanetSize = Math.round(Math.pow(planet.population, 0.2))
    let relativeMaxSize = Math.round(Math.pow(maxPlanetPop, 0.2))

    if (isNaN(relativePlanetSize)) {
      relativePlanetSize = 2;
    }

    let calculatedSize = (relativePlanetSize / relativeMaxSize) * maxDisplaySize;
    return Math.min(10 + calculatedSize, maxDisplaySize + 10);
  }

  render() {
    return (
      <ul className="list-group pdl0 clrw">
      {
        this.props.items.map((item) => {
          return <li style={{ margin:'10px 0px', width:'50px',fontSize:this.calculateTextSize(item, this.props.items)}} key={item.name} onClick={() => this.props.onItemClick(item)} >{item.name}</li>
        })
       }
      </ul>
    )
}

}

export default List;
