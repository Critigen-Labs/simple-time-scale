/** @jsx jsx */
import { AllWidgetProps, BaseWidget, jsx, React } from "jimu-core";
import { IMConfig } from "../config";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import Point = require("esri/geometry/Point");
import TimeSlider = require("esri/widgets/TimeSlider");
import TimeExtent = require("esri/TimeExtent");
import "../style/core.scss";
import { setInterval } from "timers";

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, any> {
    constructor(props) {
        super(props);

        //recover last known user input
        props.config.start =
            new Date(props.config.start) || new Date("01/01/2019");
        props.config.end = new Date(props.config.end) || new Date("01/08/2019");

        this.state = {
            mapView: null,
            extent: null,
            latitude: "",
            longitude: "",
        };
    }

    private myRef = React.createRef<HTMLDivElement>();

    // componentDidMount() {
    //     let interval = setInterval(() => {
    //         if (this.state.mapView) {
    //             clearInterval(interval);
    //             this.state.layer.visible = true;
    //         }
    //     }, 100);
    // }

    // componentDidUnmount() {
    //     this.state.layer.visible = false;
    // }

    // When the extent moves, update the state with all the updated values.

    // // When the pointer moves, take the pointer location and create a Point
    // // geometry out of it (`view.toMap(...)`), then update the state.
    // jmv.view.on("pointer-move", evt => {
    //   const point: Point = this.state.jimuMapView.view.toMap({
    //     x: evt.x,
    //     y: evt.y
    //   });
    //   this.setState({ /* ... */ });
    // });

    activeViewChangeHandler = (jmv: JimuMapView) => {
        if (jmv) {
            let prowar = jmv.view.map.layers.find(
                (l) => l.id.indexOf("Prowar") > -1
            );

            if (prowar) {
                //layer shows all data to start, need it to wait for slider to init
                // prowar.visible = false;

                // setTimeout(() => {
                //     console.log(this.state.timeslider);
                //     this.state.layer.timeExtent = new TimeExtent({
                //         start: new Date("01/01/2019"),
                //         end: new Date("12/31/2019"),
                //     });
                //     this.state.layer.visible = true;
                // }, 2000);

                let timeslider = new TimeSlider({
                    container: "timeSliderDiv",
                    view: jmv.view,
                    // show data within a given time range
                    // in this case data within one year
                    mode: "time-window",
                    fullTimeExtent: {
                        // entire extent of the timeSlider
                        start: new Date("01/01/2019"),
                        end: new Date("12/31/2019"),
                    },
                    stops: {
                        count: 52,
                        timeExtent: new TimeExtent({
                            start: new Date("01/01/2019"),
                            end: new Date("12/31/2019"),
                        }),

                        // interval: {
                        //     value: 1,
                        //     unit: "weeks"
                        //   },
                        //   timeExtent: {
                        //     start: new Date("01/01/2019"),
                        //     end: new Date("12/31/2019")
                        //   }
                    },
                    values: [
                        // location of timeSlider thumbs
                        new Date(this.props.config.start.toDateString()),
                        new Date(this.props.config.end.toDateString()),
                    ],
                });

                this.setState({
                    mapView: jmv.view,
                    layer: prowar,
                    timeslider: timeslider,
                });

                jmv.view.watch("timeExtent", (timeExtent) => {
                    this.props.config.start = timeExtent.start;
                    this.props.config.end = timeExtent.end;
                });

                jmv.view.watch("extent", (evt) => {
                    this.setState({
                        extent: evt.extent,
                    });
                });

                jmv.view.on("pointer-move", (evt) => {
                    const point: Point = this.state.mapView.toMap({
                        x: evt.x,
                        y: evt.y,
                    });
                    this.setState({
                        latitude: point.latitude.toFixed(3),
                        longitude: point.longitude.toFixed(3),
                    });
                });
            }
        }
    };

    // const containerStyle = {
    //   background: 'darkblue',
    //   color: 'white',
    //   width: 200,
    //   height: 150,
    //   padding: '1rem',
    //   borderRadius: 5
    // };

    // return <div
    //   style={containerStyle} // CSS styles applied
    // > content </div>;

    render() {
        return (
            <div className="widget-starter jimu-widget test">
                {this.props.hasOwnProperty("useMapWidgetIds") &&
                    this.props.useMapWidgetIds &&
                    this.props.useMapWidgetIds.length === 1 && (
                        <JimuMapViewComponent
                            useMapWidgetIds={this.props.useMapWidgetIds}
                            onActiveViewChange={this.activeViewChangeHandler}
                        />
                    )}
                {/* *** ADD ***
                <p>
                    Lat/Lon: {this.state.latitude} {this.state.longitude}
                </p> */}
                <div id="timeSliderDiv"></div>
            </div>
        );
    }
}
