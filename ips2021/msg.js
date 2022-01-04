// Msg
const alertType = {
    error: '[ERROR]',
    system: '[SYSTEM]'
};

const alertColor = {
    black: '\x1b[30m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    blue: '\x1b[34m%s\x1b[0m',
    magenta: '\x1b[35m%s\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m',
    white: '\x1b[37m%s\x1b[0m'
}

const alertMsg = {
    change: 'was changed.',
    add: 'was added. You have to restart gulp.',
    remove: 'was removed. You have to restart gulp.',
    clean: 'All dest file was removed.'
};

module.exports = {
    alertType,
    alertColor,
    alertMsg
}