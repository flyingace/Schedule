/* Created by davidcameron on 5/20/15. */

/*globals React */

/** @jsx React.DOM */

var Calendar = React.createClass({
    render: function () {

        return (
            <div className = "calendar">
                <Month monthName = {this.props.monthName}>
                    <Day dayName = {this.props.dayName}>
                        <Shift shiftName = {this.props.shiftName} />
                    </Day>
                </Month>
            </div>
        );
    }
});

React.render(
    <Calendar monthName = 'August' dayName = 'Monday' shiftName = 'LDPM' />,
    document.getElementById('calendar_wrapper')
);