import React from "react";
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider, useDispatch } from "react-redux";
import KeplerGl from "kepler.gl";
import {
  addDataToMap,
} from "kepler.gl/actions";
import covidData from "./covid.json";

export default function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  mapStyle: {
    mapStyles: {
      // todo style.json 응답시 내부에 maptile이 없어 호출 실패나는 현상 확인 필요!!
      positron: {
        id: 'positron',
        label: 'Positron',
        url: 'https://p-imbauth1.carrotins.com:8088/styles/positron/style.json',
        icon: 'https://p-imbauth1.carrotins.com:8088/styles/positron/7/109/50.png'
      },
      terrain: {
        id: 'osm',
        label: 'OSM Bright',
        url: 'https://p-imbauth1.carrotins.com:8088/styles/osm-bright/style.json',
        icon: 'https://p-imbauth1.carrotins.com:8088/styles/osm-bright/7/109/50.png',
        layerGroups: [
          {
            slug: 'label',
            filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
            defaultVisibility: true
          },
          {
            slug: 'road',
            filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
            defaultVisibility: true
          }
        ]
      }
    },
    // Set initial map style 
    styleType: 'positron'
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerGlReducer,
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

const Map = props => {
  const dispatch = useDispatch();

  const data = covidData;
  React.useEffect(() => {
    if (data) {
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "COVID-19",
              id: "covid19",
            },
            data,
          },
          option: {
            centerMap: true,
            readOnly: false,
          },
          config: {},
        })
      );
    }
  }, [dispatch, data]);

  return (
    <KeplerGl
      id="map"
      mapboxApiAccessToken=""
      // mapStyles={mapStyles}
      // mapStylesReplaceDefault={true}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};
