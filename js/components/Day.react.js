/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react');
var Shift = require('./Shift.react');

var Day = React.createClass({
    propTypes: {
        dayName: React.PropTypes.string.isRequired,
        dayDate: React.PropTypes.number.isRequired
    },

    getDefaultProps: function () {
        return {
            dayName: 'Day Name',
            dayDate: 0
        };
    },

    render: function () {
        var dayClass = "day " + this.props.dayName.toLowerCase();

        return (
            <div className = {dayClass} data-id = {this.props.dayID}>
                <h2>{this.props.dayName} {this.props.dayDate}</h2>
                {
                    this.props.shifts.map(function (shiftSet, index) {
                            return (
                                <Shift shiftName = {shiftSet.shiftName} shiftID = {shiftSet.shiftID}
                                       shiftSelected = {shiftSet.selected} shiftAssignee = {shiftSet.shiftAssignee}
                                       shiftAssigneeName = {shiftSet.shiftAssigneeName} key = {index}/>
                            )
                    })
                }
            </div>
        );
    }
});

module.exports = Day;