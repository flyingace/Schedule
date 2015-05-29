/* Created by davidcameron on 5/9/15. */

/*globals moment */

var Schedule = (function () {
            var staff = [],
                assignedShifts = [],
                _calendar = [],
                _createEmployee,
                _determineCalendar,
                _addEmployeeToStaff,
                _createShift,
                _createShifts,
                _createStaff,
                _assignShift,
                _assignShifts,
                _getShifts,
                _getCoverage,
                _getDayObject,
                _chooseRandomEmployee,
                _adjustCandidateAvailability,
                _checkAvailability;

            _createEmployee = function _createEmployee(empName, contractHours) {
                var employee = {
                    name: empName,
                    contractHours: contractHours,
                    unassignedHours: contractHours
                };

                return employee;
            };

            _createStaff = function _createStaff(empJSON) {
                for (var i = 0; i < empJSON.length; i++) {
                    _addEmployeeToStaff(_createEmployee(empJSON[i].name, empJSON[i].hours));
                }
            };

            _addEmployeeToStaff = function _addEmployeeToStaff(employee) {
                staff.push(employee);

            };

            _createShifts = function _createShifts(dayInfo) {
                var shiftNameArray = dayInfo.shifts,
                    shiftDate = dayInfo.date,
                    dayOfShifts = [];

                for (var i = 0; i < shiftNameArray.length; i++) {
                    var newShift = _createShift(shiftNameArray[i], shiftDate);
                    dayOfShifts.push(newShift);
                }

                return dayOfShifts;
            };

            _createShift = function _createShift(shiftName, shiftDate) {
                var shift = {};

                shift.name = shiftName;
                shift.date = shiftDate;
                shift.length = (shiftName.indexOf('L&D') < 0) ? 8 : 12;
                shift.assignee = '';

                return shift;
            };

            /**
             * Create array of consecutive dates starting with startDate and
             * ending with endDate in the format 'dddd, MMMM D YYYY' (eg, 'Sunday, May 10, 2015')
             * startDate & endDate are passed as 'YYYY-MM-DD' (eg, '2015-05-23')
             * @param startDate
             * @param endDate
             * @returns {Array}
             * @private
             */
            _determineCalendar = function _determineCalendar(startDate, endDate) {

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
                    //_calendar.push(dateInRange.format('dddd, MMMM D YYYY'));
                    //dateInRange.add(1, 'days');
                    formattedDate = dateInRange.format('dddd, MMMM, D, YYYY').split(', ');

                    dayDate = parseInt(formattedDate[2], 10);
                    dayObj = _getDayObject(formattedDate[0], dayDate);

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
            };

            _getDayObject = function _getDayObject(dayName, dayDate) {
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
                            assignee: '',
                            hours: 12
                        },
                        {
                            shiftName: 'L&D Night',
                            required: shiftRequirementArray[1],
                            assignee: '',
                            hours: 12
                        },
                        {
                            shiftName: 'Clinic 1',
                            required: shiftRequirementArray[2],
                            assignee: '',
                            hours: 8
                        },
                        {
                            shiftName: 'Clinic 2',
                            required: shiftRequirementArray[3],
                            assignee: '',
                            hours: 8
                        },
                        {
                            shiftName: 'High Risk',
                            required: shiftRequirementArray[4],
                            assignee: '',
                            hours: 8
                        },
                        {
                            shiftName: 'Friday Coverage',
                            required: shiftRequirementArray[5],
                            assignee: '',
                            hours: 4
                        }
                    ]
                };
            };


            _getShifts = function _getShifts(day) {
                var dayAndDate = day.split(', '),
                    shiftsForDay = {date: dayAndDate[1]};

                switch (dayAndDate[0]) {
                    case 'Monday':
                    case 'Thursday':
                        shiftsForDay.shifts = ['L&D_Day', 'L&D_Night', 'Clinic', 'Hi_Risk'];
                        break;
                    case 'Tuesday':
                    case 'Wednesday':
                    case 'Friday':
                        shiftsForDay.shifts = ['L&D_Day', 'L&D_Night', 'Clinic'];
                        break;
                    case 'Saturday':
                    case 'Sunday':
                        shiftsForDay.shifts = ['L&D_Day', 'L&D_Night'];
                        break;
                    default:
                        break;
                }

                return shiftsForDay;
            };

            _assignShifts = function _assignShifts(shiftsForDay) {

                for (var i = 0; i < shiftsForDay.length; i++) {
                    _assignShift(shiftsForDay[i]);
                }
            };

            _assignShift = function _assignShift(shift) {
                var candidate;

                while (shift.assignee === '') {
                    candidate = _chooseRandomEmployee();
                    var candidateIsAvailable = _checkAvailability(candidate, shift.length);

                    if (candidateIsAvailable) {
                        _adjustCandidateAvailability(candidate, shift.length);
                        shift.assignee = candidate.name;
                    }
                }
            };

//TODO: Maybe add something to this that checks whether the selected employee has
//a ratio of unassignedHours/contractHours that is above or below the average ratio
//of all other employees
            _chooseRandomEmployee = function _chooseRandomEmployee() {
                var empIndex = Math.floor(Math.random() * staff.length);

                return staff[empIndex];
            };

            _checkAvailability = function _checkAvailability(candidate, shiftLength) {
                return (candidate.unassignedHours >= shiftLength);
            };

            _adjustCandidateAvailability = function _adjustCandidateAvailability(candidate, shiftLength) {
                candidate.unassignedHours -= shiftLength;
            };

            _getCoverage = function _getCoverage() {
                var calendar = _calendar,
                    dayInformation,
                    dayOfShifts = [];

                for (var i = 0; i < calendar.length; i++) {
                    dayInformation = _getShifts(calendar[i]);
                    dayOfShifts = _createShifts(dayInformation);
                    _assignShifts(dayOfShifts);
                    assignedShifts.push(dayOfShifts);
                }

                console.log(JSON.stringify(assignedShifts));

            };

            return {
                //createEmployee: _createEmployee,
                //addEmployeeToStaff: _addEmployeeToStaff,
                //createShift: _createShift,
                //addShiftToSchedule: _addShiftToSchedule,
                createStaff: _createStaff,
                determineCalendar: _determineCalendar,
                getCoverage: _getCoverage
            };

        }
        ()
    )
    ;

var employees = {
    employees: [
        {
            name: 'a',
            hours: 40,
            available: true,
            assignments: []
        },
        {
            name: 'b',
            hours: 40,
            available: true,
            ssignments: []
        },
        {
            name: 'c',
            hours: 40,
            available: true,
            ssignments: []
        },
        {
            name: 'd',
            hours: 40,
            available: true,
            ssignments: []
        },
        {
            name: 'e',
            hours: 40,
            available: true,
            ssignments: []
        },
        {
            name: 'f',
            hours: 20,
            available: true,
            ssignments: []
        },
        {
            name: 'g',
            hours: 20,
            available: true,
            ssignments: []
        },
        {
            name: 'h',
            hours: 20,
            available: true,
            ssignments: []
        },
        {
            name: 'i',
            hours: 20,
            available: true,
            ssignments: []
        },
        {
            name: 'j',
            hours: 20,
            available: true,
            assignments: []
        }
    ]
};


Schedule.createStaff(employees.employees);
Schedule.determineCalendar('05-01-2015', '07-31-2015');
//Schedule.getCoverage();

