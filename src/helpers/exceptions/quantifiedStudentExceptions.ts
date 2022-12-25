import { Response } from 'express';

class QuantifiedStudentException {
  public static NotFound(response: Response, customMessage?: string) {
    let message = 'Could not find any records for the requested source';
    if (customMessage) message = customMessage;

    return response.status(404).json({ error: message });
  }
  public static Unauthenticated(response: Response, customMessage?: string) {
    let message = 'sorry, but you are not authenticated to use this endpoint';
    if (customMessage) message = customMessage;

    return response.status(401).send(message);
  }
  public static ServerError(response: Response, customMessage?: string) {
    let message =
      'an unexpected server error happend and the requested data could not be send';
    if (customMessage) message = customMessage;

    return response.status(500).json({ error: message });
  }
  public static MissingParameters(
    response: Response,
    parameters: Array<string>,
  ) {
    let message = 'Missing required parameter(s) in body: ';
    parameters.forEach((param) => {
      message += ` ${param},`;
    });

    return response.status(400).json({ error: message });
  }
}

export default QuantifiedStudentException;
