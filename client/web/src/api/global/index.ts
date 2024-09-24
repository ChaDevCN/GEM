import request from "../request";


export const getBingBg = async () =>
    await request({
        method: 'post',
        url: '/api/v3/v2/bing',
        data: {
            format: 'json'
        }
    })