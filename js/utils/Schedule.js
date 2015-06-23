/* Created by davidcameron on 5/9/15. */

/*globals */

var moment = require('moment');

module.exports = {

    staff: [],
    assignedShifts: [],
    calendar: [],

    createEmployee: function createEmployee(empName, contractHours) {
        return {
            name: empName,
            contractHours: contractHours,
            unassignedHours: contractHours
        };
    },

    createStaff: function createStaff(empJSON) {
        for (var i = 0; i < empJSON.length; i++) {
            this.addEmployeeToStaff(this.createEmployee(empJSON[i].name, empJSON[i].hours));
        }
    },

    addEmployeeToStaff: function addEmployeeToStaff(employee) {
        this.staff.push(employee);
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

    createShift: function createShift(shiftName, shiftDate) {
        var shift = {};

        shift.shiftName = shiftName;
        shift.date = shiftDate;
        shift.shiftLength = (shiftName.indexOf('L&D') < 0) ? 8 : 12;
        shift.shiftAssignee = '';

        return shift;
    },

    //in use
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
            calendarJSON = [],
            formattedDate,
            currentMonth = '',
            monthObj = {},
            dayObj,
            dayDate;

        //check if the date comes after the lastDate, so lastDate is included in the array
        while (!dateInRange.isAfter(lastDate)) {
            //calendar.push(dateInRange.format('dddd, MMMM D YYYY'));
            //dateInRange.add(1, 'days');
            formattedDate = dateInRange.format('dddd, MMMM, DD, YYYY').split(', ');

            dayDate = parseInt(formattedDate[2], 10);
            dayObj = this.getDayObject(formattedDate, dayDate);

            if (formattedDate[1] !== currentMonth) {
                currentMonth = formattedDate[1];
                monthObj = {
                    MonthName: currentMonth,
                    MonthID: formattedDate[1] + formattedDate[3],
                    Days: []
                };
                calendarJSON.push(monthObj);
            }
            calendarJSON[calendarJSON.length - 1].Days.push(dayObj);

            dateInRange.add(1, 'days');
        }

        return calendarJSON;
    },
    
    getShiftRequirements: function getShiftRequirements(dayName) {
        var shiftRequirementArray = [];
        
        switch (dayName) {
            case 'Monday':
            case 'Wednesday':
            case 'Thursday':
                shiftRequirementArray = [true, true, true, true, true, false];
                break;
            case 'Tuesday':
                shiftRequirementArray = [true, true, true, true, false, false];
                break;
            case 'Friday':
                shiftRequirementArray = [true, true, true, true, false, true];
                break;
            case 'Saturday':
            case 'Sunday':
                shiftRequirementArray = [true, true, false, false, false, false];
                break;
            default:
                break;
        }

        return shiftRequirementArray;
    },

    //in use
    getDayObject: function getDayObject(formattedDate, dayDate) {
        var dayName = formattedDate[0],
            dayID = formattedDate[2] + formattedDate[1] + formattedDate[3],
            shiftRequirementArray = [];


        return {
            DayDate: dayDate,
            DayName: dayName,
            DayID: dayID,
            Shifts: [
                {
                    shiftName: 'L&D Day',
                    required: this.getShiftRequirements(dayName)[0],
                    shiftAssignee: {
                        employeeName: 'Unassigned',
                        employeeID: 'unassigned',
                        committedHours: 0,
                        assignedHours: 0,
                        assignedShifts: []
                    },
                    shiftAssigneeName: 'Unassigned',
                    shiftAssigneeID: 'unassigned',
                    shiftLength: 12,
                    shiftID: dayID + '_LD',
                    selected: false
                },
                {
                    shiftName: 'L&D Night',
                    required: this.getShiftRequirements(dayName)[1],
                    shiftAssignee: {
                        employeeName: 'Unassigned',
                        employeeID: 'unassigned',
                        committedHours: 0,
                        assignedHours: 0,
                        assignedShifts: []
                    },
                    shiftAssigneeName: 'Unassigned',
                    shiftAssigneeID: 'unassigned',
                    shiftLength: 12,
                    shiftID: dayID + '_LN',
                    selected: false
                },
                {
                    shiftName: 'Clinic 1',
                    required: this.getShiftRequirements(dayName)[2],
                    shiftAssignee: {
                        employeeName: 'Unassigned',
                        employeeID: 'unassigned',
                        committedHours: 0,
                        assignedHours: 0,
                        assignedShifts: []
                    },
                    shiftAssigneeName: 'Unassigned',
                    shiftAssigneeID: 'unassigned',
                    shiftLength: 8,
                    shiftID: dayID + '_C1',
                    selected: false
                },
                {
                    shiftName: 'Clinic 2',
                    required: this.getShiftRequirements(dayName)[3],
                    shiftAssignee: {
                        employeeName: 'Unassigned',
                        employeeID: 'unassigned',
                        committedHours: 0,
                        assignedHours: 0,
                        assignedShifts: []
                    },
                    shiftAssigneeName: 'Unassigned',
                    shiftAssigneeID: 'unassigned',
                    shiftLength: 8,
                    shiftID: dayID + '_C2',
                    selected: false
                },
                {
                    shiftName: 'High Risk',
                    required: this.getShiftRequirements(dayName)[4],
                    shiftAssignee: {
                        employeeName: 'Unassigned',
                        employeeID: 'unassigned',
                        committedHours: 0,
                        assignedHours: 0,
                        assignedShifts: []
                    },
                    shiftAssigneeName: 'Unassigned',
                    shiftAssigneeID: 'unassigned',
                    shiftLength: 8,
                    shiftID: dayID + '_HR',
                    selected: false
                },
                {
                    shiftName: 'Friday Coverage',
                    required: this.getShiftRequirements(dayName)[5],
                    shiftAssignee: {
                        employeeName: 'Unassigned',
                        employeeID: 'unassigned',
                        committedHours: 0,
                        assignedHours: 0,
                        assignedShifts: []
                    },
                    shiftAssigneeName: 'Unassigned',
                    shiftAssigneeID: 'unassigned',
                    shiftLength: 4,
                    shiftID: dayID + '_FC',
                    selected: false
                }
            ]
        };
    },

    //in use
    getShifts: function getShifts(day) {
        var dayAndDate = day.split(', '),
            shiftsForDay = {date: dayAndDate[1]};

        switch (dayAndDate[0]) {
            case 'Monday':
            case 'Thursday':
                shiftsForDay.shifts = ['L&DDay', 'L&DNight', 'Clinic', 'HiRisk'];
                break;
            case 'Tuesday':
            case 'Wednesday':
            case 'Friday':
                shiftsForDay.shifts = ['L&DDay', 'L&DNight', 'Clinic'];
                break;
            case 'Saturday':
            case 'Sunday':
                shiftsForDay.shifts = ['L&DDay', 'L&DNight'];
                break;
            default:
                break;
        }

        return shiftsForDay;
    },

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
