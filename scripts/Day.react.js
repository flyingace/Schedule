/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Day = React.createClass({
    getDefaultProps: function () {
        return {dayName: "Saturday"};

    },

    render: function () {
        return (
            <div className = "day">
                <h2>{this.props.dayName}</h2>
                {
                    this.props.shifts.map(function (shiftSet) {
                        return (
                            <Shift shiftName = {shiftSet.shiftName} />
                        )
                    })
                }

            </div>
        );
    }
});