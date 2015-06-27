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
            dayDate;

        //check if the date comes after the lastDate, so lastDate is included in the array
        while (!dateInRange.isAfter(lastDate)) {

            formattedDate = dateInRange.format('dddd, MMMM, DD, YYYY').split(', ');

            dayDate = parseInt(formattedDate[2], 10);

            //TODO: Seems like passing the formatted date and the dayDate is redundant
            shiftsForDay = this.getShiftsForDay(formattedDate, dayDate);

            shiftsArray.push(shiftsForDay);

            dateInRange.add(1, 'days');
        }

        shiftArray = _.flatten(shiftsArray);

        return shiftArray;
    },

    getShiftsForDay: function getShiftsForDay(formattedDate, dayDate) {
        var dayName = formattedDate[0],
            dayID = formattedDate[2] + formattedDate[1] + formattedDate[3],
            shiftNames = this.getShiftNamesByDayOfWeek(dayName),
            shiftsForDay = [],
            shiftData;

        for (var i = 0; i < shiftNames.length; i++) {
            switch (shiftNames[i]) {
                case 'L&D Day':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 12, shiftIDSuffix: '_LD'};
                    break;
                case 'L&D Night':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 12, shiftIDSuffix: '_LN'};
                    break;
                case 'Clinic 1':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 8, shiftIDSuffix: '_C1'};
                    break;
                case 'Clinic 2':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 8, shiftIDSuffix: '_C2'};
                    break;
                case 'High Risk':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 8, shiftIDSuffix: '_HR'};
                    break;
                case 'Friday Coverage':
                    shiftData = {shiftName: shiftNames[i], shiftLength: 4, shiftIDSuffix: '_FC'};
                    break;
                default:
                    console.log('Houston, we have a problem.');
                    break;
            }

            _.assign(shiftData, {dayDate: dayDate, dayName: dayName, dayID: dayID});

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
            dayDate: shift.dayDate,
            dayName: shift.dayName,
            dayID: shift.dayID,
            shiftName: shift.shiftName,
            shiftAssignee: {
                employeeName: 'Unassigned',
                employeeID: 'unassigned',
                committedHours: 0,
                assignedHours: 0,
                assignedShifts: []
            },
            shiftAssigneeName: 'Unassigned',
            shiftAssigneeID: 'unassigned',
            shiftLength: shift.shiftLength,
            shiftID: shift.dayID + shift.shiftIDSuffix,
            selected: false
        };
    }

    /*
     The following functions are part of legacy code used in randomly assigning unassigned shifts
     I am leaving these in here for the time being in case they are needed to provide insight
     into how to go about building out this functionality, though I am doubtful that they will :)

     //in use
     assignShift: function assignShift(shift) {
     var candidate;

     while (shift.shiftAssignee === '') {
     candidate = this.chooseRandomEmployee();
     var candidateIsAvailable = this.checkAvailability(candidate, shift.length);

     if (candidateIsAvailable) {
     this.adjustCandidateAvailability(candidate, shift.length);
     shift.shiftAssignee = candidate.name;
     }
     }
     },

     //in use
     assignShifts: function assignShifts(shiftsForDay) {

     for (var i = 0; i < shiftsForDay.length; i++) {
     this.assignShift(shiftsForDay[i]);
     }
     },

     //in use
     createShifts: function createShifts(dayInfo) {
     var shiftNameArray = dayInfo.shifts,
     shiftDate = dayInfo.date,
     dayOfShifts = [];

     for (var i = 0; i < shiftNameArray.length; i++) {
     var newShift = this.createShift(shiftNameArray[i], shiftDate);
     dayOfShifts.push(newShift);
     }

     return dayOfShifts;
     },

     //in use
     //TODO: Maybe add something to this that checks whether the selected employee has
     //a ratio of unassignedHours/contractHours that is above or below the average ratio
     //of all other employees
     chooseRandomEmployee: function chooseRandomEmployee() {
     var empIndex = Math.floor(Math.random() * this.staff.length);

     return this.staff[empIndex];
     },

     //in use
     checkAvailability: function checkAvailability(candidate, shiftLength) {
     return (candidate.unassignedHours >= shiftLength);
     },

     //in use
     adjustCandidateAvailability: function adjustCandidateAvailability(candidate, shiftLength) {
     candidate.unassignedHours -= shiftLength;
     },

     //in use
     getCoverage: function getCoverage() {
     var calendar = this.calendar,
     dayInformation,
     dayOfShifts = [];

     for (var i = 0; i < calendar.length; i++) {
     dayInformation = this.getShifts(calendar[i]);
     dayOfShifts = this.createShifts(dayInformation);
     this.assignShifts(dayOfShifts);
     this.assignedShifts.push(dayOfShifts);
     }

     console.log(JSON.stringify(this.assignedShifts));
     }
     */

    //return {
    //    //createEmployee: createEmployee,
    //    //addEmployeeToStaff: addEmployeeToStaff,
    //    //createShift: createShift,
    //    //addShiftToSchedule: addShiftToSchedule,
    //    createStaff: createStaff,
    //    determineCalendar: determineCalendar,
    //    getCoverage: getCoverage
    //};

};
