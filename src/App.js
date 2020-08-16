import React, { Component, useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import "./index.css";
import "./App.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { input: "", list: [], list_1: [], locationSelected: null };
  }

  ////////////////////////////////////////////////////////////////
  alertKeyPressed(e) {
    const { value } = e.target;
    this.setState({ input: value });
  }

  async autocompleteFetchAPI(queryString) {
    const apiCall = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${queryString}&APPID=a521f0aa99ef371340547b3d5c2a1833&lang=vi&units=metric`
    );
    console.log(apiCall);
    this.setState({ locationSelected: apiCall });
    console.log(this.state.locationSelected);
  }

  async fetchCountryFromJson() {
    const { data } = await axios.get("city_list.json");
    let matches = data.filter((result) => {
      const { name, country } = result;
      const regex = new RegExp(`^${this.state.input}`, "gi");
      return name.match(regex) || country.match(regex);
    });
    if (this.state.input === "") {
      matches = [];
    }
    this.setState({ list: matches });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  render() {
    const weatherWidget = () => {
      if (this.state.locationSelected !== null) {
        switch (this.state.locationSelected.data.weather[0].main) {
          case "Clouds":
            return (
              <div>
                <div className="icon cloudy">
                  <div className="cloud"></div>
                  <div className="cloud"></div>
                </div>
              </div>
            );
          case "Rain":
            return (
              <div className="icon sun-shower">
                <div className="cloud"></div>
                <div className="sun">
                  <div className="rays"></div>
                </div>
                <div className="rain"></div>
              </div>
            );
          case "Thunderstorm":
            return (
              <div className="icon thunder-storm">
                <div className="cloud"></div>
                <div className="lightning">
                  <div className="bolt"></div>
                  <div className="bolt"></div>
                </div>
              </div>
            );
          case "Drizzle":
            return (
              <div className="icon rainy">
                <div className="cloud"></div>
                <div className="rain"></div>
              </div>
            );
          case "Clear":
            return (
              <div className="icon sunny">
                <div className="sun">
                  <div className="rays"></div>
                </div>
              </div>
            );
          default:
            return <h1>CC</h1>;
        }
      }
    };

    return (
      <div>
        {/* <Typeahead
          id="basic-typeahead-single"
          labelKey="name"
          style={{ width: "300px" }}
          options={this.state.list_1}
          minLength="3"
          placeholder="Choose a state..."
        /> */}

        <div className="container">
          <input
            type="text"
            className="search-input"
            placeholder="Enter state of America"
            onChange={(e) => (
              this.alertKeyPressed(e), this.fetchCountryFromJson()
            )}
          />
          <div className="suggestions">
            {this.state.list.map((item) => (
              <div
                onClick={(e) => this.autocompleteFetchAPI(item.name)}
                key={item.name}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {this.state.locationSelected !== null && (
          <div>
            <h1>{this.state.locationSelected.data.name}</h1>
            <h1 style={{ textTransform: "capitalize" }}>
              {this.state.locationSelected.data.weather[0].description}
            </h1>
            <h1>{this.state.locationSelected.data.main.temp} Độ C</h1>
            {weatherWidget()}
          </div>
        )}
      </div>
    );
  }
}

export default App;
