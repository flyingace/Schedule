/* Created by davidcameron on 5/9/15. */

/*globals */

var moment = require('moment'),
    _ = require('lodash');

module.exports = {

    staff: [],
    assignedShifts: [],
    calendar: [],

    /**
     * Create array of consecutive dates starting with startDate and
     * ending with endDate in the format 'dddd, MMMM D YYYY' (eg, 'Sunday, May 10, 2015')
     * startDate & endDate are passed as 'YYYY-MM-DD' (eg, '2015-05-23')
     * @param startDate
     * @param endDate
     * @returns {Array}
     * @private
     */
    determineCalendar: function determineCalendar(startDate, endDate) {

        var firstDate = moment(startDate),
            lastDate = moment(endDate),
            dateInRange = firstDate,
            shiftsArray = [],
            shiftArray,
            formattedDate,
            shiftsForDay,
            dayDate,
            week;

        //TODO: It might be worthwhile to look over the moment-range plugin
        //check if the date comes after the lastDate, so lastDate is included in the array
        while (!dateInRange.isAfter(lastDate)) {
            formattedDate = dateInRange.format('dddd, MMMM, DD, YYYY').split(', ');

            week = dateInRange.week();

            shiftsForDay = this.getShiftsForDay(formattedDate, week);

            shiftsArray.push(shiftsForDay);

            dateInRange.add(1, 'days');
        }

        shiftArray = _.flatten(shiftsArray);

        return shiftArray;
    },

    getShiftsForDay: function getShiftsForDay(formattedDate, weekNumber) {
        var monthName = formattedDate[1],
            monthID = monthName + formattedDate[3],
            dayName = formattedDate[0],
            dayDate = parseInt(formattedDate[2], 10),
            dayID = formattedDate[2] + monthID,
            shiftNames = this.getShiftNamesByDayOfWeek(dayName),
            shiftsForDay = [],
            shiftData;

        for (var i = 0; i < shiftNames.length; i++) {
            switch (shiftNames[i]) {
                case 'L&D Day':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 12, shiftIDSuffix: 'LD'};
                    break;
                case 'L&D Night':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 12, shiftIDSuffix: 'LN'};
                    break;
                case 'Clinic 1':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 8, shiftIDSuffix: 'C1'};
                    break;
                case 'Clinic 2':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 8, shiftIDSuffix: 'C2'};
                    break;
                case 'High Risk':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 8, shiftIDSuffix: 'HR'};
                    break;
                case 'Friday Coverage':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 4, shiftIDSuffix: 'FC'};
                    break;
                default:
                    console.log('Houston, we have a problem: getShiftsForDay');
                    break;
            }

            _.assign(shiftData, {monthName: monthName, monthID: monthID, weekNumber: weekNumber, dayName: dayName, dayID: dayID, dayDate: dayDate});

            shiftsForDay.push(this.generateShiftObject(shiftData));
        }

        return shiftsForDay;
    },

    getShiftNamesByDayOfWeek: function getShiftNamesByDayOfWeek(dayName) {
        var LD = 'L&D Day', LN = 'L&D Night', C1 = 'Clinic 1', C2 = 'Clinic 2', HR = 'High Risk',
            FC = 'Friday Coverage',
            shiftsForDay;

        switch (dayName) {
            case 'Monday':
            case 'Wednesday':
            case 'Thursday':
                shiftsForDay = [LD, LN, C1, C2, HR];
                break;
            case 'Tuesday':
                shiftsForDay = [LD, LN, C1, C2];
                break;
            case 'Friday':
                shiftsForDay = [LD, LN, C1, C2, FC];
                break;
            case 'Saturday':
            case 'Sunday':
                shiftsForDay = [LD, LN];
                break;
            default:
                break;
        }

        return shiftsForDay;
    },

    //TODO: Ultimately how many of these properties are needed? Can shiftAssigneeName, for example,
    //be gotten as shiftAssignee.employeeName? Also, seems like there are a lot of dates and IDs that come from dates.
    generateShiftObject: function generateShiftObject(shift) {
        return {
            monthName: shift.monthName,
            monthID: shift.monthID,
            weekNumber: shift.weekNumber,
            dayName: shift.dayName,
            dayID: shift.dayID,
            dayDate: shift.dayDate,
            shiftName: shift.shiftName,
            shiftAssignee: {},
            shiftAssigneeName: 'Unassigned',
            shiftAssigneeID: 'unassigned',
            shiftLength: shift.shiftLength,
            shiftID: shift.dayID + '-' + shift.weekNumber + '-' + shift.shiftLength + '-' + shift.shiftIDSuffix,
            selected: false
        };
    }
};
