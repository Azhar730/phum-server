import { TErrorSource } from "../interface/error";

const handleCastError = (err: any) => {
    const statusCode = 400;
    const errorSource:TErrorSource = [
        {
            path: err.path,
            message: `Invalid ${err.path}`
        }
    ]
    return {
        statusCode,
        message: 'Invalid ID',
        errorSource
    }
};
export default handleCastError;
