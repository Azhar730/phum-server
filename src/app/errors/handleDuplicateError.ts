import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];
  const errorSource: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is Already Exists`,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: `${extractedMessage} is Already Exists`,
    errorSource,
  };
};
export default handleDuplicateError