const Sequelize = require('sequelize')
const model = require('../models')


exports.getDoctor = async function() {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room',
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name'],
            [Sequelize.col('specialization_Name'), 'specialization']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: [],
        }, {
            model: model.doctor_specialization,
        }],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        order: [
            ['doctor_first_name', 'DESC']
        ],
    })


}

exports.getSchedule = async function() {
    const oneDayFromNow = Sequelize.literal('CURRENT_DATE + INTERVAL 1 DAY');
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],

        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                [Sequelize.Op.and]: [{
                    doctor_schedule_status: 'available'
                }, {
                    doctor_schedule_date: {
                        [Sequelize.Op.ne]: oneDayFromNow
                    }
                }]

            }
        }],

    })
}

// Queries for Fname
exports.getDoctor_Using_Fname = async function(Fname) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room',
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: []
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        where: [{
            doctor_first_name: {
                [Sequelize.Op.like]: `%${Fname}%`,
            },
        }, ]
    })
}
exports.getSchedule_Using_Fname = async function(Fname) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('doctor_schedule_status'), 'status'],
        ],

        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            doctor_first_name: {
                [Sequelize.Op.like]: `%${Fname}%`,
            },
        }, ]
    })
}

// Queries for Lname
exports.getDoctor_Using_Lname = async function(Lname) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room',
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: []
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        where: [{
            doctor_last_name: {
                [Sequelize.Op.like]: `%${Lname}%`,
            },
        }, ]
    })
}
exports.getSchedule_Using_Lname = async function(Lname) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_last_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('doctor_schedule_status'), 'status'],
        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            doctor_last_name: {
                [Sequelize.Op.like]: `%${Lname}%`,
            },
        }, ]
    })
}

// Queries for Fname && Lname 
exports.getDoctor_Using_Fname_Lname = async function(Fname, Lname) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_gender',
            'doctor_room',
            'doctor_contact_number', [Sequelize.fn('group_concat', Sequelize.col('HMO_Name')), 'HMO_Name']
        ],
        include: [{
            model: model.HMO,
            through: 'doctor_HMO_JunctionTable',
            attributes: [],
        }],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        group: ['doctor_ID', 'doctor_first_name', 'doctor_last_name', 'doctor_contact_number'],
        where: [{
            [Sequelize.Op.and]: [{
                doctor_first_name: {
                    [Sequelize.Op.like]: `%${Fname}%`,
                },
                doctor_last_name: {
                    [Sequelize.Op.like]: `%${Lname}%`,
                }
            }]
        }, ]
    })
}

exports.getSchedule_Using_Fname_Lname = async function(Fname, Lname) {
    return await model.doctor.findAll({
        raw: true,
        attributes: [
            'doctor_ID',
            'doctor_first_name',
            'doctor_last_name', [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'date'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_date'), '%b %e, %Y'), 'day'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_start_time'), '%h:%i%p'), 'start'],
            [Sequelize.fn('date_format', Sequelize.col('doctor_schedule_end_time'), '%h:%i%p'), 'end'],
            [Sequelize.col('doctor_schedule_status'), 'status'],
        ],
        order: [
            ['doctor_first_name', 'DESC']
        ],
        include: [{
            model: model.doctor_schedule_table,
            required: true,
            attributes: [],
            where: {
                doctor_schedule_status: 'Available'
            }

        }],
        where: [{
            [Sequelize.Op.and]: [{
                doctor_first_name: {
                    [Sequelize.Op.like]: `%${Fname}%`,
                },
                doctor_last_name: {
                    [Sequelize.Op.like]: `%${Lname}%`,
                }
            }]
        }, ]
    })
}