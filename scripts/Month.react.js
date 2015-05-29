/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Month = React.createClass({

    displayName: 'Month',

    propTypes: {},

    defaultProps: {},

    getInitialState: function () {
        return null;
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {
        return (
            <div className = "month">
                <h1>{this.props.monthName}</h1>
                {
                    this.props.days.map(function (day) {
                        return (
                            <Day dayName = {day.DayName} shifts = {day.Shifts}/>
                        )
                    })
                }
            </div>
        );
    }
});
