module.exports = {
    // Load Mock Employee Data Into localStorage
    init: function () {
        localStorage.removeItem('employees');
        localStorage.setItem('employees', JSON.stringify(
            [
                {
                    name: "S. Birdsall",
                    totalHours: 32,
                    availableHours: 32,
                    assignments: [],
                    commitment: 0.8
                },
                {
                    name: "A. Brown",
                    totalHours: 20,
                    availableHours: 20,
                    assignments: [],
                    commitment: 0.5
                },
                {
                    name: "G. Eich-piks",
                    totalHours: 24,
                    availableHours: 24,
                    assignments: [],
                    commitment: 0.6
                },
                {
                    name: "K. Fitzgerald",
                    totalHours: 20,
                    availableHours: 20,
                    assignments: [],
                    commitment: 0.5
                },
                {
                    name: "M. Gold",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "M. Larkin",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "C. Lubell",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "N. Richey",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "E. Wenzel",
                    totalHours: 40,
                    availableHours: 40,
                    assignments: [],
                    commitment: 1
                },
                {
                    name: "H. White",
                    totalHours: 20,
                    availableHours: 20,
                    assignments: [],
                    commitment: 0.5
                }
            ]
        ));
    }
};