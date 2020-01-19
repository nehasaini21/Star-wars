import React, { Component } from 'react';
import List from './List.js'
import loader from './../loader.gif';
import Modal from './../Modal.js'
import PlanetsInfo from './PlanetsInfo.js'
import {debounce} from 'throttle-debounce';


class Home extends Component {

  state = {
    planets: [],
    items: [],
    showModal : false,
    showInfoModal : false,
    errorMessage : "",
    loading : false,
    selectedPlanet : {},
    nextPage : null,
    searchText: "",
    searchAttempts: 0,
    timeElapsed: 0
  }


  componentDidMount() {
    this.getSearchData();
  }

  getSearchData = (srchText='') =>{
    this.setState({loading : true})
    fetch("https://swapi.co/api/planets/?search=" + srchText )
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        this.populateList(data.results)
        this.setState({
          nextPage: data.next
        })
      })
      .then(() => this.setState({loading : false}))
      .catch(error => {
        this.setState({
          errorMessage: "Something went wrong. Please try again.",
          showModal: true,
          loading: false
        })
      })
  }

  onListItemClicked = (selectedPlanet) => {
    this.setState({
      selectedPlanet: selectedPlanet,
      showInfoModal: true,
    })
  }

  populateList = (planets) => {
    this.setState({
      planets: planets,
      items : planets
    })
  }

  filterList = (value) => {
    this.setState({
      searchText: value
    },()=>{
      this.onSearchQuery()
    });
    
  }

  loadNextPage = () => {
    if (!this.state.nextPage) {
      return
    }
    this.setState({loading : true})
    fetch(this.state.nextPage)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        this.setState({
          planets: this.state.planets.concat(data.results),
          nextPage: data.next
        })
      this.populateList(this.state.planets)
      })
      .then(() => this.setState({loading : false}))
      .catch(error => {
        this.setState({
          errorMessage: "Something went wrong. Please try again.",
          showModal: true,
          loading: false
        })
      })
  }

  onSearchQuery = debounce(300, () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if ('Luke Skywalker' === user.name) {
      this.getSearchData(this.state.searchText)
      return
    }
    let searchAttempts = this.state.searchAttempts
    searchAttempts++

    if (searchAttempts > 15) {
      this.setState({
        errorMessage: `15 Search attempts per minute reached. Retry in ${59 - this.state.timeElapsed} seconds`,
        showModal: true
      })
      return
    }

    if (searchAttempts === 1) {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(this.resetTimer, 60000)
      clearInterval(this.intervalId)
      this.intervalId = setInterval(this.calculateSeconds, 1000)
    }
    this.setState({
      searchAttempts : searchAttempts
    })

    this.getSearchData(this.state.searchText)
  });

  resetTimer = () => {
    this.setState({
      searchAttempts : 0,
      timeElapsed: 0,
      showModal: false
    })
    clearInterval(this.intervalId)
  }

  calculateSeconds = () => {
    this.setState({
      errorMessage: `15 Search attempts per minute reached. Retry in ${59 - this.state.timeElapsed} seconds`,
      timeElapsed: this.state.timeElapsed + 1
    })
  }

  onLogout = () => {
    localStorage.removeItem('user');
    clearTimeout(this.timeoutId)
    clearInterval(this.intervalId)
    this.props.history.push("/login")
  }

  componentWillUnnount() {
    clearTimeout(this.timeoutId)
    clearInterval(this.intervalId)
  }

  render() {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
      <div className="pd40 por">
      <Modal show = {this.state.showModal} children = {this.state.errorMessage} handleClose = {() => this.setState({showModal : false})} ></Modal>
      <div className={this.state.loading ? "modal display-block" : "modal display-none"}>
          <img src={loader} className="loader" alt="loader" />
      </div>
          <h3 className="por"  style={{color:'#ffcc00'}}>
            Welcome, {user.name}
            <button className="button-normal bxrd4 poa" style={{top:'-16px',right:'0'}} onClick={this.onLogout} >Logout</button>
          </h3>
       <div className="mt20">
            <form>
                <input type="text" className="input-search pd10 bxrd4 fs14" placeholder="Search planets" onChange={(event) =>this.filterList(event.target.value)}/>
            </form>
            <List items={this.state.items} onItemClick={this.onListItemClicked}/>
            <PlanetsInfo  show= {this.state.showInfoModal} planet = {this.state.selectedPlanet} handleClose = {() => this.setState({showInfoModal : false})} />
            {this.state.items && this.state.nextPage ? <button disabled={!this.state.nextPage} className="button-normal" onClick={this.loadNextPage} >Load More</button>: ''}
          </div>
      </div>
    );
  }
}

export default Home;
