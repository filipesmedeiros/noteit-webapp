export function buildQueryString(params) {
    let string = '?';

    params.forEach((param, index) => {
        if(index !== 0)
            string += '&';

        string += (param.name);
        string += '=';
        string += (param.value);
    });

    return string;
}