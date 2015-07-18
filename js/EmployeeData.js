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
                    contractedHours: 32,
                    assignedHours: 32,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.8
                },
                {
                    employeeName: 'A. Brown',
                    employeeID: 'abrown',
                    contractedHours: 20,
                    assignedHours: 20,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.5
                },
                {
                    employeeName: 'G. Eich-piks',
                    employeeID: 'geichpiks',
                    contractedHours: 24,
                    assignedHours: 24,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.6
                },
                {
                    employeeName: 'K. Fitzgerald',
                    employeeID: 'kfitzgerald',
                    contractedHours: 20,
                    assignedHours: 20,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.5
                },
                {
                    employeeName: 'M. Gold',
                    employeeID: 'mgold',
                    contractedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'M. Larkin',
                    employeeID: 'mlarkin',
                    contractedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'C. Lubell',
                    employeeID: 'clubell',
                    contractedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'N. Richey',
                    employeeID: 'nrichey',
                    contractedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'E. Wenzel',
                    employeeID: 'ewenzel',
                    contractedHours: 40,
                    assignedHours: 40,
                    assignedShifts: [],
                    available: true,
                    commitment: 1
                },
                {
                    employeeName: 'H. White',
                    employeeID: 'hwhite',
                    contractedHours: 20,
                    assignedHours: 20,
                    assignedShifts: [],
                    available: true,
                    commitment: 0.5
                },
                {
                    employeeName: 'Unassigned',
                    employeeID: 'unassigned',
                    contractedHours: 0,
                    assignedHours: 0,
                    assignedShifts: [],
                    available: true,
                    commitment: 0
                }
            ]
        ));
    }
};
