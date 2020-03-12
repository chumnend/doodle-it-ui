import axios from "axios";
import config from "../../config"

async function getOne (userId, itemId) {
    try {
        let url = `${config.prefix}/v1/doodle/${itemId}?apiKey=${config.key}&userId=${userId}`;
        let { data } = await axios.get(url);
        return data;
    } catch(err) {
        try {
            err.message = err.response.data.message;
        } catch(e) {
            err.message = "Something went wrong, try again later";
        } finally {
            throw err;
        }
    }
}

export default getOne;