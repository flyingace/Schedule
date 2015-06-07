/* Created by davidcameron on 5/9/15. */

/*globals */

var moment = require('./moment');

module.exports =  {

    staff: [],
    assignedShifts: [],
    calendar: [],
    //var staff = [],
    //    assignedShifts = [],
    //    calendar = [],
    //    createEmployee,
    //    determineCalendar,
    //    addEmployeeToStaff,
    //    createShift,
    //    createShifts,
    //    createStaff,
    //    assignShift,
    //    assignShifts,
    //    assignShifts,
    //    getShifts,
    //    getCoverage,
    //    getDayObject,
    //    chooseRandomEmployee,
    //    adjustCandidateAvailability,
    //    checkAvailability;

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
            formattedDate = dateInRange.format('dddd, MMMM, D, YYYY').split(', ');

            dayDate = parseInt(formattedDate[2], 10);
            dayObj = this.getDayObject(formattedDate[0], dayDate);

            if (formattedDate[1] !== currentMonth) {
                currentMonth = formattedDate[1];
                monthObj = {
                    MonthName: currentMonth,
                    Days: []
                };
                calendarJSON.push(monthObj);
            }
            calendarJSON[calendarJSON.length - 1].Days.push(dayObj);

            dateInRange.add(1, 'days');
        }

        return calendarJSON;
    },

    getDayObject: function getDayObject(dayName, dayDate) {
        var shiftRequirementArray = [];

        switch (dayName) {
            case 'Monday':
            case 'Thursday':
                shiftRequirementArray = [true, true, true, true, true, false];
                break;
            case 'Tuesday':
            case 'Wednesday':
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

        return {
            DayDate: dayDate,
            DayName: dayName,
            Shifts: [
                {
                    shiftName: 'L&D Day',
                    required: shiftRequirementArray[0],
                    shiftAssignee: '',
                    shiftLength: 12
                },
                {
                    shiftName: 'L&D Night',
                    required: shiftRequirementArray[1],
                    shiftAssignee: '',
                    shiftLength: 12
                },
                {
                    shiftName: 'Clinic 1',
                    required: shiftRequirementArray[2],
                    shiftAssignee: '',
                    shiftLength: 8
                },
                {
                    shiftName: 'Clinic 2',
                    required: shiftRequirementArray[3],
                    shiftAssignee: '',
                    shiftLength: 8
                },
                {
                    shiftName: 'High Risk',
                    required: shiftRequirementArray[4],
                    shiftAssignee: '',
                    shiftLength: 8
                },
                {
                    shiftName: 'Friday Coverage',
                    required: shiftRequirementArray[5],
                    shiftAssignee: '',
                    shiftLength: 4
                }
            ]
        };
    },

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

    assignShifts: function assignShifts(shiftsForDay) {

        for (var i = 0; i < shiftsForDay.length; i++) {
            this.assignShift(shiftsForDay[i]);
        }
    },

    //TODO: Maybe add something to this that checks whether the selected employee has
    //a ratio of unassignedHours/contractHours that is above or below the average ratio
    //of all other employees
    chooseRandomEmployee: function chooseRandomEmployee() {
        var empIndex = Math.floor(Math.random() * this.staff.length);

        return this.staff[empIndex];
    },

    checkAvailability: function checkAvailability(candidate, shiftLength) {
        return (candidate.unassignedHours >= shiftLength);
    },

    adjustCandidateAvailability: function adjustCandidateAvailability(candidate, shiftLength) {
        candidate.unassignedHours -= shiftLength;
    },

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
