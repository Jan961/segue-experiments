function checkNan(data) {
    switch(typeof data) {
        case 'number':
            return isNaN(data);
        case 'object':
            return data.length === 0 ? true : false;
    }
}

export default checkNan;