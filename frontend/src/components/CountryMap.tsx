import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// New TopoJSON data for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

// List of countries to color
const coloredCountries = ["United States", "Brazil", "India"];

const WorldMap: React.FC = () => {
  return (
    <div>
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.NAME;
              const isColored = coloredCountries.includes(countryName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isColored ? "orange" : "#EEE"}
                  stroke="#000"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "lightblue", outline: "none" },
                    pressed: { fill: "darkblue", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
