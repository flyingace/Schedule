/* Created by davidcameron on 5/20/15. */

/*globals React */

/** @jsx React.DOM */

var Calendar = React.createClass({

    displayName: 'Calendar',

    propTypes: {
        calendarData: React.PropTypes.object
    },

    getDefaultProps: function () {

    },

    getInitialState: function () {
        return {
            calendarData: {}
        }
    },

    componentDidMount: function () {
        this._fetchRemoteData();
    },

    componentWillUnmount: function () {
    },

    render: function () {

        if (!this.state.calendarData.length) {
            return (
                <div className = "calendar">
                    No calendar yet!
                </div>
            )
        }

        return (
            <div className = "calendar">
                {
                    this.state.calendarData.map(function (month, index) {
                        return (
                            <Month monthName = {month.MonthName} days = {month.Days} key = {index}/>
                        )
                    })
                }
            </div>
        );
    },

    _fetchRemoteData: function () {
        var calendarJSON = Schedule.determineCalendar('05-01-2015', '07-31-2015');
        //setTimeout(function () {
            this.setState({
                calendarData: calendarJSON
            });
            console.log(this.state);

        //}.bind(this), 2000);
    }
});

React.render(
    <Calendar />,
    document.getElementById('calendar_wrapper')
);

/*
 Start with a date range
 Loop through each date
 Date object contains Day, Month, Year, Day of Week
 For each Month create a Month element
 Render each Month
 For each day in a month create a Day element
 Extract Date and Day of Week from Date Object
 Render each Day, Display Day of Week and Day of Month
 For each Day of Week Determine Shifts
 Render each shift

 !!!
 Start with Date Range
 Create JSON object for All Months, Days, Shifts
 */