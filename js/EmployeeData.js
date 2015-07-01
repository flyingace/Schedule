/*globals module*/

module.exports = {
    // Load Mock Employee Data Into localStorage
    init: function () {
        localStorage.removeItem('employees');
        localStorage.setItem('employees', JSON.stringify(
            [
                {
                    employeeName: 'S. Birdsall',
                    employeeID: 'sbirdsall',
                    committedHours: 32,
                    assignedHours: 32,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.8
                },
                {
                    employeeName: 'A. Brown',
                    employeeID: 'abrown',
                    committedHours: 20,
                    assignedHours: 20,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.5
                },
                {
                    employeeName: 'G. Eich-piks',
                    employeeID: 'geichpiks',
                    committedHours: 24,
                    assignedHours: 24,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.6
                },
                {
                    employeeName: 'K. Fitzgerald',
                    employeeID: 'kfitzgerald',
                    committedHours: 20,
                    assignedHours: 20,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.5
                },
                {
                    employeeName: 'M. Gold',
                    employeeID: 'mgold',
                    committedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'M. Larkin',
                    employeeID: 'mlarkin',
                    committedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'C. Lubell',
                    employeeID: 'clubell',
                    committedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'N. Richey',
                    employeeID: 'nrichey',
                    committedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'E. Wenzel',
                    employeeID: 'ewenzel',
                    committedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'H. White',
                    employeeID: 'hwhite',
                    committedHours: 20,
                    assignedHours: 20,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.5
                },
                {
                    employeeName: 'Unassigned',
                    employeeID: 'unassigned',
                    committedHours: 0,
                    assignedHours: 0,
                    assignedShifts: [],
                    available: true,
                    commitment: 0
                }
            ]
        ));
    }
};
