module.exports = {
    // Load Mock Employee Data Into localStorage
    init: function () {
        localStorage.removeItem('employees');
        localStorage.setItem('employees', JSON.stringify(
            [
                {
                    name: "S. Birdsall",
                    employeeID: "sbirdsall",
                    totalHours: 32,
                    availableHours: 32,
                    assignments: [],
                    commitment: 0.8
                },
                {
                    name: "A. Brown",
                    employeeID: "abrown",
                    totalHours: 20,
                    availableHours: 20,
                    assignments: [],
                    commitment: 0.5
                },
                {
                    name: "G. Eich-piks",
                    employeeID: "geichpiks",
                    totalHours: 24,
                    availableHours: 24,
                    assignments: [],
                    commitment: 0.6
                },
                {
                    name: "K. Fitzgerald",
                    employeeID: "kfitzgerald",
                    totalHours: 20,
                    availableHours: 20,
                    assignments: [],
                    commitment: 0.5
                },
                {
                    name: "M. Gold",
                    employeeID: "mgold",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "M. Larkin",
                    employeeID: "mlarkin",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "C. Lubell",
                    employeeID: "clubell",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "N. Richey",
                    employeeID: "nrichey",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "E. Wenzel",
                    employeeID: "ewenzel",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "H. White",
                    employeeID: "hw",
                    totalHours: 20,
                    availableHours: 20,
                    assignments: [],
                    commitment: 0.5
                }
            ]
        ));
    }
};