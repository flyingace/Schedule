/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

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
            React.createElement("div", {className: "shift"}, React.createElement("p", null, this.props.shiftName, ": ", this.props.shiftAssignee))
        );
    },

    getClassesFromProps: function (props) {
        if (this.props.shiftAssignee === 'Unassigned') {
            React.findDOMNode(this).className = "shift unassigned";
        }
    }
});