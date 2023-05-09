export const settingsService = {
    getSetting
}

/**
 *
 * Add a setting for each feature you want to have control over
 *
 */
const settings = [
    {name:"EmailIngest", value:false,},
    {name:"SingleLogin", value:false,},
]

function getSetting(settingName) {

    for (let i = 0; i < settings.length; i++) {
        if (settings[i].name === settingName) {
            return settings[i].value;
        }
    }
}