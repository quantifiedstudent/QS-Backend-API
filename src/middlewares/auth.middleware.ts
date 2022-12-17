// This is a temporary middleware for getting the user id from the auth token in the authorization header.
import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';

function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const API_URL = "https://fhict.instructure.com/api/v1/users/self";
    const token = request.headers.authorization;

    fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        res.json()
        .then((result) => {
            if (result.id) {
                response.locals.userInfo = result;
            } else {
                response.locals.userInfo = null;
            }
            next();
        })
    }).catch(() => {
        response.locals.userInfo = null;
    })

}

export default authMiddleware;