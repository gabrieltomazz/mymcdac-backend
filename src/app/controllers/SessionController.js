import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import SocialAccount from '../models/SocialAccount';
import AuthConfig from '../../config/auth';
import loginGoogle from '../../config/google-util';
import loginFacebook from '../../config/facebook-util';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: { mensagem: 'Dados Inválidos!' } });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: { mensagem: 'Usuário não existe!' } });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: { password: 'Senha incorreta!' } });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, AuthConfig.secret, {
                expiresIn: AuthConfig.expiresIn,
            }),
        });
    }

    async googleAuth(req, res) {
        return res.json(loginGoogle.urlGoogle());
    }

    async callbackGoogle(req, res) {
        const { provider_id, userEmail, userName } = await loginGoogle.getGoogleAccountFromCode(req.query.code);

        const userSocial = await SocialAccount.findOne({
            where: { provider_id },
            include: {
                model: User,
                attributes: ['id', 'name', 'email'],
            },
        });

        let id = null;
        let name = null;
        let email = null;

        if (!userSocial) {
            const userData = await User.create({ name: userName, email: userEmail });

            if (!userData) {
                return res.status(400).json({ error: { mensagem: 'Error ao criar Usuário!' } });
            }

            await SocialAccount.create({ user_id: userData.id, provider: 'google', provider_id });

            id = userData.id;
            name = userData.name;
            email = userData.email;
        } else {
            id = userSocial.User.id;
            name = userSocial.User.name;
            email = userSocial.User.email;
        }

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, AuthConfig.secret, {
                expiresIn: AuthConfig.expiresIn,
            }),
        });
    }

    async facebookAuth(req, res) {
        return res.json(loginFacebook.urlFacebook());
    }

    async callbackFacebook(req, res) {
        const access_token = await loginFacebook.getAccessTokenFromCode(req.query.code);
        const { provider_id, userEmail, userName } = await loginFacebook.getFacebookUserData(access_token);

        const userSocial = await SocialAccount.findOne({
            where: { provider_id },
            include: {
                model: User,
                attributes: ['id', 'name', 'email'],
            },
        });

        let id = null;
        let name = null;
        let email = null;

        if (!userSocial) {
            const userData = await User.create({ name: userName, email: userEmail });

            if (!userData) {
                return res.status(400).json({ error: { mensagem: 'Error ao criar Usuário!' } });
            }

            await SocialAccount.create({ user_id: userData.id, provider: 'facebook', provider_id });

            id = userData.id;
            name = userData.name;
            email = userData.email;
        } else {
            id = userSocial.User.id;
            name = userSocial.User.name;
            email = userSocial.User.email;
        }

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, AuthConfig.secret, {
                expiresIn: AuthConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
