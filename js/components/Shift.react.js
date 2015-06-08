/* Created by davidcameron on 5/21/15. */

/*globals */

var React = require('react');

var Shift = React.createClass({

    displayName: 'Shift',

    propTypes: {
        shiftAssignee: React.PropTypes.string,
        shiftLength: React.PropTypes.number.isRequired,
        shiftName: React.PropTypes.string.isRequired
    },

    getDefaultProps: function () {
        return {
            shiftAssignee: 'Unassigned',
            shiftLength: 12,
            shiftName: 'Shift'
        }
    },

    componentWillMount: function () {
    },

    componentDidMount: function () {
      this.getClassesFromProps();
    },

    render: function () {
        return (
            <div className = "shift" onClick = {this.onShiftClick}>{this.props.shiftName}: {this.props.shiftAssignee}</div>
        );
    },

    onShiftClick: function (e) {
        console.log(e.target);
    },

    getClassesFromProps: function (props) {
        if (this.props.shiftAssignee === 'Unassigned') {
            React.findDOMNode(this).className = "shift unassigned";
        }
    }
});

module.exports = Shift;