﻿import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { UserModel, User, accessRoles } from '../models/user';
import { get as configGet } from 'config';
import { status, ROUTE_STATUS, USERS_STATUS } from '../libs/validate';

const userTypes: accessRoles[] = [accessRoles.admin, accessRoles.user];



export class UsersController {

	/**
	 * Gets All registered users
	 * @param  {Req}		req  request
	 * @param  {Res}		res  response
	 * @param  {Next}		next next
	 */
	public static async getAllUsers(req: Req, res: Res, next: Next) {
		const users = <User[]>await UserModel.find({}, {
			username: 1, role: 1, createdAt: 1
		}).lean().sort('username_lower');
		if (!users) { return res.status(404); } // TODO: Fix me
		return res.status(200).send(users);
	}

	/**
	 * Sets a user role
	 * @param  {Req}		req  request
	 * @param  {Res}		res  response
	 * @param  {Next}		next next
	 */
	public static async patchUser(req: Req, res: Res, next: Next) {
		const user: User = req.body,
			adminUser: User = <User>req.user,
			routeId: string = req.params.id,
			username_low = user.username.toLowerCase();

		if (!adminUser.isOfRole(accessRoles.admin)) {
			return res.status(401).send(status(ROUTE_STATUS.UNAUTHORISED));
		}

		if (routeId !== user._id) {
			return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE));
		}

		const patchUser = (err: any, patchingUser: User) => {
			if (err) { return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE)); }

			patchingUser.username = user.username;
			patchingUser.username_lower = username_low;
			patchingUser.role = user.role;
			patchingUser.save((err2, updated) => {
				if (err2) { return next(err2); }
				if (updated) {
					return res.status(200).send(status(USERS_STATUS.USER_ROLE_UPDATED));
				}
				// user obj with bad id
				return res.status(400).send(status(USERS_STATUS.DATA_UNPROCESSABLE));
			});
		};

		const foundUser = await UserModel.findOne({ username_lower: username_low });

		if (foundUser && (foundUser.id !== user._id)) { // intentional .id
			return res.status(400).send(status(USERS_STATUS.USERNAME_NOT_AVILIABLE));
		}

		if (foundUser && foundUser.id === user._id) {
			return patchUser(null, foundUser);
		}
		UserModel.findById(user._id, patchUser);
	}
}
