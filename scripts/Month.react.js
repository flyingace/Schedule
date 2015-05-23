/* Created by davidcameron on 5/21/15. */

/*globals */

/** @jsx React.DOM */

var Month = React.createClass({
    render: function () {
        return (
            <div className = "month">
                <h1>{this.props.monthName}</h1>
            </div>
        );
    }
});
