import React from "react";
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider, useDispatch } from "react-redux";
import KeplerGl from "kepler.gl";
import useSwr from "swr";
import {wrapTo, loadCustomMapStyle, addDataToMap, addCustomMapStyle} from 'kepler.gl/actions';
import covidData from "./covid.json";

const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));
const wrapIt = wrapTo("map");

const OpenMapTilesStyles = {
  layers : [
    {
      id: 'voyager',
      label: 'Voyager',
      url: 'https://api.maptiler.com/maps/voyager/style.json?key=kznYvrAC6DrOZXPCW05C',
      icon: 'https://api.maptiler.com/maps/voyager/256/0/0/0.png?key=kznYvrAC6DrOZXPCW05C'
    }
  ] 
};

export default function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

const Map = props => {
  const dispatch = useDispatch();
  // const { data } = useSwr("covid", async () => {
  //   const response = await fetch(
  //     "https://gist.githubusercontent.com/leighhalliday/a994915d8050e90d413515e97babd3b3/raw/a3eaaadcc784168e3845a98931780bd60afb362f/covid19.json"
  //   );
  //   const data = await response.json();
  //   return data;
  // });
  const data = covidData;

  React.useEffect(() => {
    if (data) {
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "COVID-19",
              id: "covid19"
            },
            data
          },
          option: {
            centerMap: true,
            readOnly: false
          },
          config: {}
        })
      );
    }
    dispatch(
      wrapIt(
        loadCustomMapStyle({
          style: OpenMapTilesStyles,
          error: false
        })
      )
    );
    dispatch(wrapIt(addCustomMapStyle()));
  }, [dispatch, data]);


  return (
    <KeplerGl
      id="map"
      mapboxApiAccessToken=""
      // mapStyles={mapStyles}
      mapStylesReplaceDefault={true} 
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}
